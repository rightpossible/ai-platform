import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { PlanApp } from '@/lib/db/schemas/planApp';

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
    const planApps = await PlanApp.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      planApps
    });

  } catch (error) {
    console.error('Error fetching plan-apps:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch plan-apps'
    }, { status: 500 });
  }
}

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
    const { planId, appId, isIncluded } = await request.json();

    if (!planId || !appId) {
      return NextResponse.json({ error: 'Plan ID and App ID are required' }, { status: 400 });
    }

    await connectDB();

    // Check if relationship already exists
    const existingPlanApp = await PlanApp.findOne({ planId, appId });
    if (existingPlanApp) {
      // Update existing relationship
      existingPlanApp.isIncluded = isIncluded !== undefined ? isIncluded : true;
      await existingPlanApp.save();
      
      return NextResponse.json({
        success: true,
        planApp: existingPlanApp,
        message: 'Plan-app relationship updated'
      });
    }

    // Create new plan-app relationship
    const newPlanApp = new PlanApp({
      planId,
      appId,
      isIncluded: isIncluded !== undefined ? isIncluded : true
    });

    await newPlanApp.save();

    return NextResponse.json({
      success: true,
      planApp: newPlanApp,
      message: 'App added to plan successfully'
    });

  } catch (error) {
    console.error('Error creating plan-app relationship:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create plan-app relationship'
    }, { status: 500 });
  }
}