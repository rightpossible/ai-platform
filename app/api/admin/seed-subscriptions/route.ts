import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { seedSubscriptionData } from '@/lib/db/seed-subscriptions';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Run seed data
    const result = await seedSubscriptionData();
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }

  } catch (error) {
    console.error('Seed subscriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to seed subscription data' },
      { status: 500 }
    );
  }
}