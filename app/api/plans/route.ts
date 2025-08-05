import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { SubscriptionPlan, PlanApp, App } from '@/lib/db/schemas';

// Public API - accessible to all users
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all active plans with their app relationships
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ position: 1 })
      .lean();

    const planApps = await PlanApp.find({})
      .populate('appId')
      .lean();

    const allApps = await App.find({ status: 'active' }).lean();

    // Group apps by plan
    const plansWithApps = plans.map(plan => {
      const includedApps = planApps
        .filter(pa => pa.planId.toString() === (plan._id as string).toString() && pa.isIncluded)
        .map(pa => pa.appId)
        .filter(Boolean);

      return {
        ...plan,
        includedApps,
        appCount: includedApps.length
      };
    });

    return NextResponse.json({
      plans: plansWithApps,
      allApps,
      totalPlans: plans.length
    });

  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}