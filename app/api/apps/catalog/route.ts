import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { getUserAppAccess } from '@/lib/access-control/app-access';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user details from database using Auth0 ID
    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Use the centralized access control function
    const { apps, subscription } = await getUserAppAccess(user.id);

    return NextResponse.json({
      apps,
      userSubscription: subscription ? {
        plan: {
          name: subscription.planId, // This will need to be populated properly
          position: subscription.planLevel
        },
        status: subscription.status
      } : null
    });

  } catch (error) {
    console.error('Error fetching app catalog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch app catalog' },
      { status: 500 }
    );
  }
}