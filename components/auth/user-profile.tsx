'use client';

import { useUser } from "@auth0/nextjs-auth0";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={user.picture} alt={user.name || 'User'} />
          <AvatarFallback>
            {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>User ID:</strong> {user.sub}
          </div>
          <div>
            <strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Last Login:</strong> {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}