'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CircleIcon, Loader2 } from 'lucide-react';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');

  useEffect(() => {
    // Build the Auth0 login URL with query parameters
    let loginUrl = '/auth/login';
    const params = new URLSearchParams();
    
    if (redirect) params.append('returnTo', redirect);
    if (priceId) params.append('priceId', priceId);
    if (inviteId) params.append('inviteId', inviteId);
    
    if (params.toString()) {
      loginUrl += `?${params.toString()}`;
    }
    
    // Redirect to Auth0 login
    window.location.href = loginUrl;
  }, [redirect, priceId, inviteId]);

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Redirecting to login...
        </h2>
        
        <div className="mt-8 flex justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          If you're not redirected automatically, 
          <a href="/auth/login" className="text-orange-600 hover:text-orange-500 ml-1">
            click here to sign in
          </a>
        </p>
      </div>
    </div>
  );
}
