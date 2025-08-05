import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import SubscriptionManager from '@/lib/subscription/subscription-manager';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's subscription
    const subscription = await SubscriptionManager.getUserSubscription(user.id);
    
    // Get user's accessible apps
    const userApps = await SubscriptionManager.getUserApps(user.id);

    return NextResponse.json({
      subscription,
      apps: userApps,
      hasActiveSubscription: subscription?.status === 'active'
    }, { status: 200 });

  } catch (error) {
    console.error('Get subscription status API error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}