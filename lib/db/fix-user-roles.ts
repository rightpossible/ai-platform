import { connectDB } from './connection';
import { User } from './schemas/user';

export async function fixUserRoles() {
  await connectDB();

  try {
    console.log('🔧 Fixing invalid user roles...');

    // Find users with invalid roles
    const invalidRoleUsers = await User.find({
      role: { $nin: ['member', 'platform_admin', 'app_admin'] }
    });

    if (invalidRoleUsers.length > 0) {
      console.log(`Found ${invalidRoleUsers.length} users with invalid roles:`);
      
      for (const user of invalidRoleUsers) {
        console.log(`- User ${user.email}: role="${user.role}"`);
        
        // Convert common invalid roles to valid ones
        let newRole = 'member'; // Default fallback
        
        if (user.role === 'admin' || user.role === 'owner') {
          newRole = 'platform_admin';
        } else if (user.role === 'app_admin') {
          newRole = 'app_admin';
        }
        
        await User.findByIdAndUpdate(user._id, { role: newRole });
        console.log(`  ✅ Updated to: role="${newRole}"`);
      }
    } else {
      console.log('✅ No users with invalid roles found');
    }

    // Also check for any users without roles
    const usersWithoutRole = await User.find({
      $or: [
        { role: { $exists: false } },
        { role: null },
        { role: '' }
      ]
    });

    if (usersWithoutRole.length > 0) {
      console.log(`Found ${usersWithoutRole.length} users without roles, setting to 'member'`);
      await User.updateMany(
        {
          $or: [
            { role: { $exists: false } },
            { role: null },
            { role: '' }
          ]
        },
        { role: 'member' }
      );
      console.log('✅ Updated users without roles');
    }

    return { 
      success: true, 
      message: 'User roles fixed successfully',
      invalidRolesFixed: invalidRoleUsers.length,
      usersWithoutRoles: usersWithoutRole.length
    };

  } catch (error) {
    console.error('❌ Error fixing user roles:', error);
    return { 
      success: false, 
      message: `Error fixing user roles: ${error}`,
      error 
    };
  }
}