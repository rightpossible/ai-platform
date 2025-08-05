import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { App } from '@/lib/db/schemas/app';

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

    // Parse request body
    const { name, slug, ssoUrl, description, status, color } = await request.json();

    if (!name || !slug || !ssoUrl) {
      return NextResponse.json({ error: 'Name, slug, and SSO URL are required' }, { status: 400 });
    }

    await connectDB();

    // Check if slug already exists
    const existingApp = await App.findOne({ slug });
    if (existingApp) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Create new app
    const newApp = new App({
      name,
      slug,
      ssoUrl,
      description,
      status: status || 'active',
      color: color || 'bg-blue-500'
    });

    await newApp.save();

    return NextResponse.json({
      success: true,
      app: newApp
    });

  } catch (error) {
    console.error('Error creating app:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create app'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
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

    await connectDB();
    const apps = await App.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      apps
    });

  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch apps'
    }, { status: 500 });
  }
}