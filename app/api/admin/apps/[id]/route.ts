import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { App } from '@/lib/db/schemas/app';
import { PlanApp } from '@/lib/db/schemas/planApp';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find the app first to check if it exists
    const app = await App.findById(params.id);
    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Delete all plan-app relationships for this app
    await PlanApp.deleteMany({ appId: params.id });

    // Delete the app
    await App.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'App deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting app:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete app'
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const app = await App.findById(params.id);
    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      app
    });

  } catch (error) {
    console.error('Error fetching app:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch app'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const appData = await request.json();
    const {
      name,
      slug,
      ssoUrl,
      description,
      status,
      color,
      // Plan-related fields
      requiresPlan,
      minimumPlanLevel,
      category,
      // Enhanced catalog fields
      shortDescription,
      longDescription,
      screenshots,
      features,
      tags,
      website,
      supportUrl,
      integrationStatus,
      popularity,
      rating,
      isPopular,
      isFeatured,
      launchInNewTab
    } = appData;

    if (!name || !slug || !ssoUrl) {
      return NextResponse.json({ error: 'Name, slug, and SSO URL are required' }, { status: 400 });
    }

    await connectDB();

    // Check if the app exists
    const existingApp = await App.findById(params.id);
    if (!existingApp) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Check if slug already exists (but allow current app to keep its slug)
    const slugCheck = await App.findOne({ slug, _id: { $ne: params.id } });
    if (slugCheck) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Update the app with all fields
    const updatedApp = await App.findByIdAndUpdate(
      params.id,
      {
        name,
        slug,
        ssoUrl,
        description,
        status,
        color,
        requiresPlan: requiresPlan || false,
        minimumPlanLevel: minimumPlanLevel || 0,
        category: category || 'business',
        shortDescription: shortDescription || '',
        longDescription: longDescription || '',
        screenshots: screenshots || [],
        features: features || [],
        tags: tags || [],
        website: website || '',
        supportUrl: supportUrl || '',
        integrationStatus: integrationStatus || 'ready',
        popularity: popularity || 0,
        rating: rating || 0,
        isPopular: isPopular || false,
        isFeatured: isFeatured || false,
        launchInNewTab: launchInNewTab || false,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      app: updatedApp,
      message: 'App updated successfully'
    });

  } catch (error) {
    console.error('Error updating app:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update app'
    }, { status: 500 });
  }
}