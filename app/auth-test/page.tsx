'use client';

import { useUser } from '@auth0/nextjs-auth0';
import LoginButton from '@/components/auth/login-button';
import LogoutButton from '@/components/auth/logout-button';
import UserProfile from '@/components/auth/user-profile';

export default function AuthTestPage() {
  const { user, isLoading } = useUser();

  return (
    <div className="container mx-auto p-8 space-y-8 ">
      <h1 className="text-3xl font-bold text-center">Auth0 Integration Test</h1>
      
      <div className="flex justify-center space-x-4">
        {!user ? (
          <LoginButton />
        ) : (
          <LogoutButton />
        )}
      </div>

      {isLoading && (
        <div className="text-center">Loading user data...</div>
      )}

      {user && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Welcome, {user.name}!</h2>
          <UserProfile />
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Raw User Data:</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {!user && !isLoading && (
        <div className="text-center space-y-4">
          <p>Please log in to see your profile information.</p>
        </div>
      )}
    </div>
  );
}