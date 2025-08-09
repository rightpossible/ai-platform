import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { getUserAppAccess } from '@/lib/access-control/app-access';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { auth0 } from '@/lib/auth0';
import { SubscriptionPlan } from '@/lib/db/schemas/subscriptionPlan';

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

    // Filter out ERPNext app from regular catalog (it has its own dedicated section)
    const filteredApps = apps.filter(app => app.slug !== 'business-suite');

    // Get the actual plan data if subscription exists
    let planData = null;
    if (subscription) {
      await connectDB();
      const plan = await SubscriptionPlan.findById(subscription.planId);
      planData = plan ? {
        name: plan.name,
        position: subscription.planLevel
      } : {
        name: 'Unknown Plan',
        position: subscription.planLevel
      };
    }

    return NextResponse.json({
      apps: filteredApps,
      userSubscription: subscription ? {
        plan: planData,
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