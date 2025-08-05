import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/schemas/user';
import { SSOToken } from '@/lib/db/schemas/ssoToken';

export default async function AdminDashboard() {
  const session = await auth0.getSession();
  const user = await getUserByAuth0Id(session!.user.sub);
  
  // Get some basic stats
  await connectDB();
  const totalUsers = await User.countDocuments();
  const totalTokensToday = await SSOToken.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Overview</h2>
        <p className="text-gray-600">Manage your SSO system and applications</p>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">SSO Logins Today</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalTokensToday}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900">Your Role</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <a 
            href="/admin/apps" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Manage Apps
          </a>
          <a 
            href="/admin/users" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View Users
          </a>
          <a 
            href="/admin/activity" 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            SSO Activity
          </a>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Database Connection</span>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Auth0 Integration</span>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">SSO Token System</span>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Working</span>
          </div>
        </div>
      </div>
    </div>
  );
}