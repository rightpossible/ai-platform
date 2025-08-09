import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { checkAppAccess } from '@/lib/access-control/app-access';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user details from database using Auth0 ID
    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check access specifically for the ERPNext/business-suite app
    const accessResult = await checkAppAccess(user.id, 'business-suite');

    return NextResponse.json({
      hasAccess: accessResult.hasAccess,
      accessReason: accessResult.reason,
      requiredPlanLevel: accessResult.requiredPlanLevel,
      userPlanLevel: accessResult.userPlanLevel,
      upgradeUrl: accessResult.upgradeUrl
    });

  } catch (error) {
    console.error('Error checking ERPNext access:', error);
    return NextResponse.json(
      { error: 'Failed to check ERPNext access' },
      { status: 500 }
    );
  }
}
