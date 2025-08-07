import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { seedErpNextApp } from '@/lib/db/seed-erpnext-app';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Platform admin access required' }, { status: 403 });
    }

    // Seed ERPNext app
    const app = await seedErpNextApp();
    
    // Check if app was just created or already existed
    const isNewApp = app.createdAt && new Date(app.createdAt).getTime() > (Date.now() - 1000);
    
    return NextResponse.json({
      success: true,
      message: isNewApp ? 'ERPNext app seeded successfully' : 'ERPNext app already exists',
      app,
      isNewApp
    });

  } catch (error) {
    console.error('Error seeding ERPNext app:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed ERPNext app'
    }, { status: 500 });
  }
}
