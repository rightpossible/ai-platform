import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/schemas/user';
import { Team } from '@/lib/db/schemas/team';
import { TeamMember } from '@/lib/db/schemas/teamMember';
export async function syncAuth0User(auth0User: any) {
  try {
    await connectDB();

    // Check if user already exists by Auth0 ID or email
    let user = await User.findOne({
      $or: [
        { auth0Id: auth0User.sub },
        { email: auth0User.email }
      ]
    });

    if (user) {
      // Update existing user
      user.name = auth0User.name || user.name;
      user.email = auth0User.email!;
      user.auth0Id = auth0User.sub;
      user.picture = auth0User.picture || user.picture;
      user.emailVerified = auth0User.email_verified || user.emailVerified;
      user.lastLogin = new Date();
      
      // Fix invalid roles during sync
      const validRoles = ['member', 'platform_admin', 'app_admin'];
      if (!validRoles.includes(user.role)) {
        console.log(`Fixing invalid role for ${user.email}: "${user.role}" -> "member"`);
        user.role = user.role === 'admin' || user.role === 'owner' ? 'platform_admin' : 'member';
      }
      
      await user.save();
      console.log('Updated existing user:', user.email);
    } else {
      // Create new user
      const newUser = new User({
        name: auth0User.name,
        email: auth0User.email,
        auth0Id: auth0User.sub,
        picture: auth0User.picture,
        emailVerified: auth0User.email_verified || false,
        role: 'member', // Default role for new users
        lastLogin: new Date()
      });

      await newUser.save();
      console.log('Created new user:', newUser.email);

      // Create a default team for the new user
      const team = new Team({
        name: `${auth0User.name || auth0User.email}'s Team`
      });

      await team.save();

      // Add user to the team as owner
      const teamMember = new TeamMember({
        userId: newUser._id.toString(),
        teamId: team._id.toString(),
        role: 'owner'
      });

      await teamMember.save();
      console.log('Created team and team membership for new user');

      user = newUser;
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        auth0Id: user.auth0Id,
        picture: user.picture,
        role: user.role,
        lastLogin: user.lastLogin
      }
    };
  } catch (error) {
    console.error('Error syncing Auth0 user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getUserByAuth0Id(auth0Id: string) {
  try {
    await connectDB();
    
    const user = await User.findOne({ auth0Id });
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      auth0Id: user.auth0Id,
      picture: user.picture,
      role: user.role,
      lastLogin: user.lastLogin
    };
  } catch (error) {
    console.error('Error getting user by Auth0 ID:', error);
    return null;
  }
}