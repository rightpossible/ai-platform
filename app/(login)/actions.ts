'use server';

import { z } from 'zod';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getUserWithTeam } from '@/lib/db/queries';
import { connectDB } from '@/lib/db/mongodb';
import {
  User,
  Team,
  TeamMember,
  ActivityLog,
  Invitation,
  ActivityType,
  type IUser,
  type ITeam,
  type ITeamMember,
  type IActivityLog,
  type IInvitation
} from '@/lib/db/schemas';
import {
  validatedAction,
  validatedActionWithUser
} from '@/lib/auth/middleware';

async function logActivity(
  teamId: string | null | undefined,
  userId: string,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  
  await connectDB();
  
  const newActivity = new ActivityLog({
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || ''
  });
  
  await newActivity.save();
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  await connectDB();

  // Find user by email
  const foundUser = await User.findOne({ email, deletedAt: { $exists: false } });

  if (!foundUser) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password
    };
  }

  const isPasswordValid = await comparePasswords(
    password,
    foundUser.passwordHash
  );

  if (!isPasswordValid) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password
    };
  }

  // Find user's team
  const teamMember = await TeamMember.findOne({ userId: foundUser._id.toString() })
    .populate('teamId');
  
  const foundTeam = teamMember?.teamId as ITeam | null;

  await Promise.all([
    setSession(foundUser),
    logActivity(foundTeam?._id.toString(), foundUser._id.toString(), ActivityType.SIGN_IN)
  ]);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    return createCheckoutSession({ team: foundTeam, priceId });
  }

  redirect('/dashboard');
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional()
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, inviteId } = data;

  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return {
      error: 'Failed to create user. Please try again.',
      email,
      password
    };
  }

  const passwordHash = await hashPassword(password);

  const createdUser = new User({
    email,
    passwordHash,
    role: 'member' // Default role, will be overridden if there's an invitation
  });

  await createdUser.save();

  let teamId: string;
  let userRole: string;
  let createdTeam: ITeam | null = null;

  if (inviteId) {
    // Check if there's a valid invitation
    const invitation = await Invitation.findOne({
      _id: inviteId,
      email,
      status: 'pending'
    });

    if (invitation) {
      teamId = invitation.teamId;
      userRole = invitation.role;

      // Update invitation status
      await Invitation.findByIdAndUpdate(invitation._id, { status: 'accepted' });

      await logActivity(teamId, createdUser._id.toString(), ActivityType.ACCEPT_INVITATION);

      createdTeam = await Team.findById(teamId);
    } else {
      return { error: 'Invalid or expired invitation.', email, password };
    }
  } else {
    // Create a new team if there's no invitation
    createdTeam = new Team({
      name: `${email}'s Team`
    });

    await createdTeam!.save();

    if (!createdTeam) {
      return {
        error: 'Failed to create team. Please try again.',
        email,
        password
      };
    }

    teamId = createdTeam._id.toString();
    userRole = 'owner';

    await logActivity(teamId, createdUser._id.toString(), ActivityType.CREATE_TEAM);
  }

  const newTeamMember = new TeamMember({
    userId: createdUser._id.toString(),
    teamId: teamId,
    role: userRole
  });

  await Promise.all([
    newTeamMember.save(),
    logActivity(teamId, createdUser._id.toString(), ActivityType.SIGN_UP),
    setSession(createdUser)
  ]);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    return createCheckoutSession({ team: createdTeam, priceId });
  }

  redirect('/dashboard');
});

export async function signOut() {
  const user = (await getUser()) as IUser;
  const userWithTeam = await getUserWithTeam(user._id.toString());
  await logActivity(userWithTeam?.teamId, user._id.toString(), ActivityType.SIGN_OUT);
  (await cookies()).delete('session');
}

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
});

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'Current password is incorrect.'
      };
    }

    if (currentPassword === newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'New password must be different from the current password.'
      };
    }

    if (confirmPassword !== newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: 'New password and confirmation password do not match.'
      };
    }

    const newPasswordHash = await hashPassword(newPassword);
    const userWithTeam = await getUserWithTeam(user._id.toString());

    await connectDB();

    await Promise.all([
      User.findByIdAndUpdate(user._id, { passwordHash: newPasswordHash }),
      logActivity(userWithTeam?.teamId, user._id.toString(), ActivityType.UPDATE_PASSWORD)
    ]);

    return {
      success: 'Password updated successfully.'
    };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100)
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        password,
        error: 'Incorrect password. Account deletion failed.'
      };
    }

    const userWithTeam = await getUserWithTeam(user._id.toString());

    await logActivity(
      userWithTeam?.teamId,
      user._id.toString(),
      ActivityType.DELETE_ACCOUNT
    );

    await connectDB();

    // Soft delete
    await User.findByIdAndUpdate(user._id, {
      deletedAt: new Date(),
      email: `${user.email}-${user._id}-deleted` // Ensure email uniqueness
    });

    if (userWithTeam?.teamId) {
      await TeamMember.deleteOne({
        userId: user._id.toString(),
        teamId: userWithTeam.teamId
      });
    }

    (await cookies()).delete('session');
    redirect('/sign-in');
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address')
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;
    const userWithTeam = await getUserWithTeam(user._id.toString());

    await connectDB();

    await Promise.all([
      User.findByIdAndUpdate(user._id, { name, email }),
      logActivity(userWithTeam?.teamId, user._id.toString(), ActivityType.UPDATE_ACCOUNT)
    ]);

    return { name, success: 'Account updated successfully.' };
  }
);

const removeTeamMemberSchema = z.object({
  memberId: z.string()
});

export const removeTeamMember = validatedActionWithUser(
  removeTeamMemberSchema,
  async (data, _, user) => {
    const { memberId } = data;
    const userWithTeam = await getUserWithTeam(user._id.toString());

    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    await connectDB();

    await TeamMember.deleteOne({
      _id: memberId,
      teamId: userWithTeam.teamId
    });

    await logActivity(
      userWithTeam.teamId,
      user._id.toString(),
      ActivityType.REMOVE_TEAM_MEMBER
    );

    return { success: 'Team member removed successfully' };
  }
);

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'owner'])
});

export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { email, role } = data;
    const userWithTeam = await getUserWithTeam(user._id.toString());

    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    await connectDB();

    // Check if user is already a member
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const existingMember = await TeamMember.findOne({
        userId: existingUser._id.toString(),
        teamId: userWithTeam.teamId
      });

      if (existingMember) {
        return { error: 'User is already a member of this team' };
      }
    }

    // Check if there's an existing invitation
    const existingInvitation = await Invitation.findOne({
      email,
      teamId: userWithTeam.teamId,
      status: 'pending'
    });

    if (existingInvitation) {
      return { error: 'An invitation has already been sent to this email' };
    }

    // Create a new invitation
    const newInvitation = new Invitation({
      teamId: userWithTeam.teamId,
      email,
      role,
      invitedBy: user._id.toString(),
      status: 'pending'
    });

    await newInvitation.save();

    await logActivity(
      userWithTeam.teamId,
      user._id.toString(),
      ActivityType.INVITE_TEAM_MEMBER
    );

    // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
    // await sendInvitationEmail(email, userWithTeam.team.name, role)

    return { success: 'Invitation sent successfully' };
  }
);
