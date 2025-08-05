import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { connectDB } from './mongodb';
import { 
  User, 
  Team, 
  TeamMember, 
  ActivityLog, 
  type IUser, 
  type ITeam,
  type ITeamMember,
  type IActivityLog,
  ActivityType 
} from './schemas';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'string'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  await connectDB();

  const user = await User.findOne({
    _id: sessionData.user.id,
    deletedAt: { $exists: false }
  });

  return user;
}

export async function getTeamByStripeCustomerId(customerId: string) {
  await connectDB();
  
  const team = await Team.findOne({ stripeCustomerId: customerId });
  return team;
}

export async function updateTeamSubscription(
  teamId: string,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await connectDB();
  
  await Team.findByIdAndUpdate(
    teamId,
    {
      ...subscriptionData,
      updatedAt: new Date()
    },
    { new: true }
  );
}

export async function getUserWithTeam(userId: string) {
  await connectDB();
  
  const user = await User.findById(userId);
  if (!user) return null;

  const teamMember = await TeamMember.findOne({ userId });
  
  return {
    user,
    teamId: teamMember?.teamId || null
  };
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  await connectDB();

  return await ActivityLog.find({ userId: user._id })
    .populate('userId', 'name')
    .sort({ timestamp: -1 })
    .limit(10)
    .lean()
    .then(logs => logs.map(log => ({
      id: log._id,
      action: log.action,
      timestamp: log.timestamp,
      ipAddress: log.ipAddress,
      userName: (log.userId as any)?.name || null
    })));
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  await connectDB();

  const teamMember = await TeamMember.findOne({ userId: user._id })
    .populate({
      path: 'teamId',
      model: 'Team'
    });

  if (!teamMember || !teamMember.teamId) {
    return null;
  }

  const team = teamMember.teamId as ITeam;
  
  // Get all team members for this team
  const allTeamMembers = await TeamMember.find({ teamId: team._id })
    .populate({
      path: 'userId',
      model: 'User',
      select: '_id name email'
    });

  return {
    ...team.toObject(),
    teamMembers: allTeamMembers.map(member => ({
      ...member.toObject(),
      user: member.userId
    }))
  };
}
