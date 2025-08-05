import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { generateSecureAppToken } from '@/lib/sso/token-generator';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { SSOToken } from '@/lib/db/schemas/ssoToken';
import { App } from '@/lib/db/schemas/app';
import { checkAppAccess } from '@/lib/access-control/app-access';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Get Auth0 user session
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    // Parse request body
    const { targetApp } = await request.json();
    if (!targetApp) {
      return NextResponse.json({ error: 'Target app is required' }, { status: 400 });
    }

    // Get user details from database using Auth0 ID
    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has access to the target app
    const accessResult = await checkAppAccess(user.id, targetApp);
    if (!accessResult.hasAccess) {
      let errorMessage = 'Access denied to this application.';
      let statusCode = 403;

      switch (accessResult.reason) {
        case 'app_inactive':
          errorMessage = 'The requested application is currently unavailable.';
          statusCode = 404;
          break;
        case 'subscription_expired':
          errorMessage = 'Your subscription has expired. Please renew your subscription to access this app.';
          statusCode = 402;
          break;
        case 'upgrade_required':
          errorMessage = `This application requires a higher subscription plan. Please upgrade to access it.`;
          statusCode = 403;
          break;
      }

      return NextResponse.json({ 
        error: errorMessage,
        reason: accessResult.reason,
        requiredPlanLevel: accessResult.requiredPlanLevel,
        userPlanLevel: accessResult.userPlanLevel,
        upgradeUrl: accessResult.upgradeUrl
      }, { status: statusCode });
    }

    // Generate SSO token
    const tokenData = generateSecureAppToken({
      userId: user.id,
      email: user.email,
      name: user.name || user.email,
      role: user.role || 'member',
      targetApp,
      permissions: [], // TODO: Add subscription-based permissions later
      expirationMinutes: 5
    }); 

    // Connect to database and store token info
    await connectDB();
    
    // Create hash of token for storage (security best practice)
    const tokenHash = createHash('sha256').update(tokenData.token).digest('hex');
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Store token info in database
    const ssoTokenRecord = new SSOToken({
      userId: user.id,
      targetApp,
      tokenHash,
      nonce: tokenData.token.split('.')[1], // Use part of JWT as nonce reference
      expiresAt: new Date(tokenData.expiresAt),
      ipAddress,
      userAgent
    });

    await ssoTokenRecord.save();

    // Get app from database
    const app = await App.findOne({ slug: targetApp, status: 'active' });
    if (!app) {
      return NextResponse.json({ 
        error: 'App not found or inactive',
        targetApp 
      }, { status: 404 });
    }

    const redirectUrl = `${app.ssoUrl}?token=${encodeURIComponent(tokenData.token)}`;

    // Return token for frontend
    return NextResponse.json({
      success: true,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
      targetApp: tokenData.targetApp,
      redirectUrl
    });

  } catch (error) {
    console.error('SSO token generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate SSO token'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get recent SSO token activity for this user
    await connectDB();
    const recentTokens = await SSOToken.find({
      userId: user.id,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    })
    .select('targetApp expiresAt usedAt createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

    return NextResponse.json({
      success: true,
      recentActivity: recentTokens
    });

  } catch (error) {
    console.error('SSO activity fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch SSO activity'
    }, { status: 500 });
  }
}