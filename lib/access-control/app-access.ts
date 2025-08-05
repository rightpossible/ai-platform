import { connectDB } from '@/lib/db/connection';
import { App } from '@/lib/db/schemas/app';
import { UserSubscription } from '@/lib/db/schemas/userSubscription';
import { PlanApp } from '@/lib/db/schemas/planApp';
import { SubscriptionPlan } from '@/lib/db/schemas/subscriptionPlan';

export interface AppAccessResult {
  hasAccess: boolean;
  reason: 'free' | 'included_in_plan' | 'plan_level_access' | 'upgrade_required' | 'app_inactive' | 'subscription_expired';
  requiredPlanLevel?: number;
  userPlanLevel?: number;
  upgradeUrl?: string;
}

export interface UserAccessInfo {
  userId: string;
  subscription?: {
    planId: string;
    planLevel: number;
    status: string;
    expiresAt?: Date;
  };
}

/**
 * Check if a user has access to a specific app
 */
export async function checkAppAccess(
  userId: string, 
  appSlug: string
): Promise<AppAccessResult> {
  try {
    await connectDB();

    // Get the app
    const app = await App.findOne({ slug: appSlug, status: 'active' });
    if (!app) {
      return {
        hasAccess: false,
        reason: 'app_inactive'
      };
    }

    // If app doesn't require a plan, it's free
    if (!app.requiresPlan) {
      return {
        hasAccess: true,
        reason: 'free'
      };
    }

    // Get user's active subscription
    const userSubscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    }).populate('planId');

    if (!userSubscription) {
      return {
        hasAccess: false,
        reason: 'upgrade_required',
        requiredPlanLevel: app.minimumPlanLevel || 1,
        userPlanLevel: 0,
        upgradeUrl: '/pricing'
      };
    }

    // Check if subscription is expired
    if (userSubscription.expiresAt && new Date() > userSubscription.expiresAt) {
      return {
        hasAccess: false,
        reason: 'subscription_expired',
        upgradeUrl: '/pricing'
      };
    }

    const userPlan = userSubscription.planId;
    const userPlanLevel = userPlan.position || 0;

    // Check if app is explicitly included in the plan
    const planApp = await PlanApp.findOne({
      planId: userPlan._id,
      appId: app._id,
      isIncluded: true
    });

    if (planApp) {
      return {
        hasAccess: true,
        reason: 'included_in_plan',
        userPlanLevel
      };
    }

    // Check if user's plan level meets minimum requirement
    if (app.minimumPlanLevel && userPlanLevel >= app.minimumPlanLevel) {
      return {
        hasAccess: true,
        reason: 'plan_level_access',
        userPlanLevel,
        requiredPlanLevel: app.minimumPlanLevel
      };
    }

    // User needs to upgrade
    return {
      hasAccess: false,
      reason: 'upgrade_required',
      requiredPlanLevel: app.minimumPlanLevel || 1,
      userPlanLevel,
      upgradeUrl: '/pricing'
    };

  } catch (error) {
    console.error('Error checking app access:', error);
    return {
      hasAccess: false,
      reason: 'upgrade_required'
    };
  }
}

/**
 * Get all apps with access information for a user
 */
export async function getUserAppAccess(userId: string): Promise<{
  apps: Array<any>;
  subscription: UserAccessInfo['subscription'] | null;
}> {
  try {
    await connectDB();

    // Get user's subscription
    const userSubscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    }).populate('planId');

    let subscription: UserAccessInfo['subscription'] | null = null;
    if (userSubscription) {
      subscription = {
        planId: userSubscription.planId._id,
        planLevel: userSubscription.planId.position || 0,
        status: userSubscription.status,
        expiresAt: userSubscription.expiresAt
      };
    }

    // Get all active apps
    const apps = await App.find({ status: 'active' }).sort({ 
      isFeatured: -1, 
      isPopular: -1, 
      popularity: -1,
      name: 1 
    });

    // If no subscription, only show free apps
    if (!subscription) {
      const appsWithAccess = apps.map(app => ({
        ...app.toObject(),
        hasAccess: !app.requiresPlan,
        accessReason: app.requiresPlan ? 'upgrade_required' : 'free',
        userPlanLevel: 0,
        requiredPlanLevel: app.minimumPlanLevel
      }));

      return { apps: appsWithAccess, subscription };
    }

    // Get apps included in user's plan
    const planApps = await PlanApp.find({
      planId: subscription.planId,
      isIncluded: true
    });
    
    const includedAppIds = new Set(planApps.map(pa => pa.appId.toString()));

    // Check access for each app
    const appsWithAccess = apps.map(app => {
      let hasAccess = false;
      let accessReason = '';

      if (!app.requiresPlan) {
        hasAccess = true;
        accessReason = 'free';
      } else if (includedAppIds.has(app._id.toString())) {
        hasAccess = true;
        accessReason = 'included_in_plan';
      } else if (app.minimumPlanLevel && subscription.planLevel >= app.minimumPlanLevel) {
        hasAccess = true;
        accessReason = 'plan_level_access';
      } else {
        hasAccess = false;
        accessReason = 'upgrade_required';
      }

      return {
        ...app.toObject(),
        hasAccess,
        accessReason,
        requiredPlanLevel: app.minimumPlanLevel,
        userPlanLevel: subscription.planLevel
      };
    });

    return { apps: appsWithAccess, subscription };

  } catch (error) {
    console.error('Error getting user app access:', error);
    return { apps: [], subscription: null };
  }
}

/**
 * Middleware function to check app access in API routes
 */
export async function requireAppAccess(
  userId: string, 
  appSlug: string
): Promise<{ success: boolean; error?: string; statusCode?: number }> {
  const accessResult = await checkAppAccess(userId, appSlug);
  
  if (accessResult.hasAccess) {
    return { success: true };
  }

  switch (accessResult.reason) {
    case 'app_inactive':
      return { 
        success: false, 
        error: 'App is currently unavailable',
        statusCode: 404
      };
    case 'subscription_expired':
      return { 
        success: false, 
        error: 'Your subscription has expired. Please renew to continue using this app.',
        statusCode: 402
      };
    case 'upgrade_required':
      return { 
        success: false, 
        error: `This app requires a higher subscription plan. Please upgrade to access it.`,
        statusCode: 403
      };
    default:
      return { 
        success: false, 
        error: 'Access denied',
        statusCode: 403
      };
  }
}

/**
 * Check if user can access a specific plan level
 */
export async function checkPlanLevelAccess(
  userId: string, 
  requiredLevel: number
): Promise<boolean> {
  try {
    await connectDB();

    const userSubscription = await UserSubscription.findOne({
      userId,
      status: 'active'
    }).populate('planId');

    if (!userSubscription) {
      return requiredLevel === 0; // Only level 0 (free) accessible without subscription
    }

    const userPlanLevel = userSubscription.planId.position || 0;
    return userPlanLevel >= requiredLevel;

  } catch (error) {
    console.error('Error checking plan level access:', error);
    return false;
  }
}