'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name?: string;
  email: string;
  auth0Id?: string;
  picture?: string;
  emailVerified?: boolean;
  role: string;
  lastLogin?: string;
  createdAt: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Users Administration</h1>
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  if (error) { 
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Users Administration</h1>
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users Administration</h1>
          <p className="text-muted-foreground">Total users: {users.length}</p>
        </div>
        <Button onClick={fetchUsers}>Refresh</Button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.picture} alt={user.name || 'User'} />
                  <AvatarFallback>
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {user.name || 'Unnamed User'}
                    <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    {user.emailVerified && (
                      <Badge variant="outline" className="text-green-600">
                        Verified
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Auth0 ID:</strong> {user.auth0Id || 'None'}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Last Login:</strong> {
                    user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleString()
                      : 'Never'
                  }
                </div>
                <div>
                  <strong>Database ID:</strong> {user.id}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No users found in the database.</p>
            <p className="text-sm mt-2">Users will appear here after they log in with Auth0.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}