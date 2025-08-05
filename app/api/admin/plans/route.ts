import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { SubscriptionPlan, PlanApp, App } from '@/lib/db/schemas';

export async function GET(request: NextRequest) {
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

    await connectDB();

    // Get all plans with their app relationships
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

    await connectDB();

    const {
      name,
      slug,
      description,
      price,
      yearlyPrice,
      features,
      maxUsers,
      storageQuota,
      isPopular,
      includedApps
    } = await request.json();

    // Validate required fields
    if (!name || !slug || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPlan = await SubscriptionPlan.findOne({ slug });
    if (existingPlan) {
      return NextResponse.json(
        { error: 'Plan with this slug already exists' },
        { status: 400 }
      );
    }

    // Get next position
    const maxPosition = await SubscriptionPlan.findOne()
      .sort({ position: -1 })
      .select('position')
      .lean() as { position?: number } | null;
    
    const nextPosition = (maxPosition?.position || 0) + 1;

    // Create the plan
    const plan = new SubscriptionPlan({
      name,
      slug: slug.toLowerCase(),
      description,
      price: Math.round(price * 100), // Convert to cents
      yearlyPrice: yearlyPrice ? Math.round(yearlyPrice * 100) : undefined,
      features: features || [],
      maxUsers: maxUsers || -1,
      storageQuota: storageQuota || -1,
      position: nextPosition,
      isPopular: isPopular || false,
      isActive: true
    });

    await plan.save();

    // Create plan-app relationships if provided
    if (includedApps && Array.isArray(includedApps)) {
      const planAppRelationships = includedApps.map(appId => ({
        planId: plan._id.toString(),
        appId,
        isIncluded: true
      }));

      await PlanApp.insertMany(planAppRelationships);
    }

    return NextResponse.json({ 
      message: 'Plan created successfully',
      plan: {
        ...plan.toObject(),
        includedApps: includedApps || []
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create plan error:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}