import { auth0 } from '@/lib/auth0';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/schemas/user';
import { redirect } from 'next/navigation';

export default async function MakeAdminPage() {
  const session = await auth0.getSession();
  
  if (!session || !session.user) {
    redirect('/login');
  }

  await connectDB();
  
  // Security check: Only allow if no platform admin exists yet
  const existingAdmin = await User.findOne({ role: 'platform_admin' });
  if (existingAdmin) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800 mb-2">
            ❌ Access Denied
          </h1>
          <p className="text-red-700 mb-4">
            A platform admin already exists. Contact the existing admin for access.
          </p>
          <a 
            href="/dashboard" 
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Make the first user platform admin (for initial setup only)
  await User.findOneAndUpdate(
    { auth0Id: session.user.sub },
    { role: 'platform_admin' },
    { new: true }
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h1 className="text-xl font-semibold text-green-800 mb-2">
          ✅ Admin Access Granted!
        </h1>
        <p className="text-green-700 mb-4">
          You ({session.user.email}) have been made an admin.
        </p>
        <a 
          href="/admin" 
          className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go to Admin Dashboard
        </a>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Note:</strong> This page should be removed in production. It's only for initial setup.</p>
      </div>
    </div>
  );
}