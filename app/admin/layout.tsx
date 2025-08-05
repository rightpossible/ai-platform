import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  // Check if user has platform admin role
  const user = await getUserByAuth0Id(session.user.sub);
  if (!user || user.role !== 'platform_admin') {
    redirect('/dashboard'); // Redirect non-platform-admins to regular dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Admin Only</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700">
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="px-6 py-3">
          <div className="flex space-x-8">
            <a 
              href="/admin" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 pb-2 border-b-2 border-transparent hover:border-gray-300"
            >
              Overview
            </a>
            <a 
              href="/admin/apps" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 pb-2 border-b-2 border-transparent hover:border-gray-300"
            >
              Apps
            </a>
            <a 
              href="/admin/users" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 pb-2 border-b-2 border-transparent hover:border-gray-300"
            >
              Users
            </a>
            <a 
              href="/admin/plans" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 pb-2 border-b-2 border-transparent hover:border-gray-300"
            >
              Plans
            </a>
            <a 
              href="/admin/activity" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 pb-2 border-b-2 border-transparent hover:border-gray-300"
            >
              SSO Activity
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}