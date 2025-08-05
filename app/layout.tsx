import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import {  Auth0Provider } from '@auth0/nextjs-auth0';
import { UserSyncProvider } from '@/components/auth/user-sync-provider';

export const metadata: Metadata = {
  title: 'Next.js SaaS Starter',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <Auth0Provider>
          <UserSyncProvider>
            <SWRConfig
              value={{
                fallback: {
                  // We do NOT await here
                  // Only components that read this data will suspend
                  '/api/user': getUser(),
                  '/api/team': getTeamForUser()
                }
              }}
            >
              {children}
            </SWRConfig>
          </UserSyncProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
