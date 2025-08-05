'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { useEffect, useState } from 'react';

export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCompleted, setSyncCompleted] = useState(false);

  useEffect(() => {
    async function syncUser() {
      if (!user || isLoading || isSyncing || syncCompleted) {
        return;
      }

      setIsSyncing(true);
      
      try {
        const response = await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json(); 
        
        if (result.success) {
          console.log('User synced successfully:', result.user);
          setSyncCompleted(true);
        } else {
          console.error('Failed to sync user:', result.error);
        }
      } catch (error) {
        console.error('Error syncing user:', error);
      } finally {
        setIsSyncing(false);
      }
    }

    syncUser();
  }, [user, isLoading, isSyncing, syncCompleted]);

  return <>{children}</>;
}