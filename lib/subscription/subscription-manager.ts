// Subscription management system that works with both mock and real Stripe

import { connectDB } from '@/lib/db/connection';
import { User, SubscriptionPlan, UserSubscription } from '@/lib/db/schemas';
import { stripe, createCustomer, createSubscription, cancelSubscription } from '@/lib/payments/stripe-client';
import { isMockStripe } from '@/lib/payments/stripe-config';

export interface SubscribeToPlancnParams {
  userId: string;
  planId: string;
  isYearly?: boolean;
  trialDays?: number;
}

export interface SubscriptionResult {
  success: boolean;
  message: string;
  subscription?: any;
  checkoutUrl?: string;
  error?: string;
}

export class SubscriptionManager {
  
  /**
   * Subscribe a user to a plan
   */
  static async subscribeToPlan(params: SubscribeToPlancnParams): Promise<SubscriptionResult> {
    try {
      await connectDB();

      // Get user and plan
      const user = await User.findById(params.userId);
      const plan = await SubscriptionPlan.findById(params.planId);

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (!plan) {
        return { success: false, message: 'Plan not found' };
      }

      // Check if user already has an active subscription
      const existingSubscription = await UserSubscription.findOne({
        userId: params.userId,
        status: { $in: ['active', 'trialing'] }
      });

      // Get the current plan details if subscription exists
      let currentPlan = null;
      if (existingSubscription) {
        currentPlan = await SubscriptionPlan.findById(existingSubscription.planId);
        
        // Check if trying to subscribe to the same plan
        if (existingSubscription.planId.toString() === params.planId) {
          return { 
            success: false, 
            message: 'You are already subscribed to this plan.' 
          };
        }

        // Special handling for free plan upgrades
        if (currentPlan && currentPlan.price === 0) {
          console.log(`User upgrading from free plan to paid plan ${params.planId}`);
          // For free plan, we can upgrade directly without cancelling
          // Just mark the free subscription as upgraded
          existingSubscription.status = 'cancelled';
          existingSubscription.cancelledAt = new Date();
          await existingSubscription.save();
        } else {
          // For paid plans, cancel the existing subscription
          console.log(`User changing from paid plan ${existingSubscription.planId} to ${params.planId}`);
          await this.cancelSubscriptionInternal(existingSubscription);
        }
      }

      // Create Stripe customer if not exists
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await createCustomer(user.email, user.name);
        stripeCustomerId = customer.id;
        
        // Update user with Stripe customer ID
        await User.findByIdAndUpdate(params.userId, { 
          stripeCustomerId: stripeCustomerId 
        });
      }

      // For mock Stripe, create subscription directly
      if (isMockStripe) {
        return await this.handleMockSubscription(params, user, plan, stripeCustomerId, existingSubscription, currentPlan);
      }

      // For real Stripe, create checkout session
      return await this.handleRealStripeSubscription(params, user, plan, stripeCustomerId);

    } catch (error) {
      console.error('Subscribe to plan error:', error);
      return { 
        success: false, 
        message: 'Failed to create subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Handle mock Stripe subscription (immediate success)
   */
  private static async handleMockSubscription(
    params: SubscribeToPlancnParams,
    user: any,
    plan: any,
    stripeCustomerId: string,
    existingSubscription?: any,
    currentPlan?: any
  ): Promise<SubscriptionResult> {
    try {
      // Create mock price ID
      const mockPriceId = `price_mock_${plan.slug}_${params.isYearly ? 'yearly' : 'monthly'}`;
      
      // Create subscription in mock Stripe
      const stripeSubscription = await createSubscription(
        stripeCustomerId,
        mockPriceId,
        params.trialDays
      );

      // Create subscription in our database
      const userSubscription = new UserSubscription({
        userId: params.userId,
        planId: params.planId,
        status: params.trialDays ? 'trialing' : 'active',
        stripeSubscriptionId: stripeSubscription.id,
        isYearly: params.isYearly || false,
        startDate: new Date(),
        trialEndsAt: params.trialDays ? 
          new Date(Date.now() + (params.trialDays * 24 * 60 * 60 * 1000)) : 
          undefined
      });

      await userSubscription.save();

      // Update user's current plan
      await User.findByIdAndUpdate(params.userId, {
        currentPlanId: params.planId,
        subscriptionStatus: userSubscription.status
      });

      console.log(`🎭 Mock subscription created for ${user.email} to ${plan.name}`);

              const upgradeMessage = existingSubscription && currentPlan?.price === 0 ? 
          `Successfully upgraded from ${currentPlan.name} to ${plan.name}! (Mock Stripe)` :
          `Successfully subscribed to ${plan.name}! (Mock Stripe)`;

        return {
          success: true,
          message: upgradeMessage,
          subscription: userSubscription
        };

    } catch (error) {
      console.error('Mock subscription error:', error);
      return {
        success: false,
        message: 'Failed to create mock subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Handle real Stripe subscription (checkout session)
   */
  private static async handleRealStripeSubscription(
    params: SubscribeToPlancnParams,
    user: any,
    plan: any,
    stripeCustomerId: string
  ): Promise<SubscriptionResult> {
    try {
      // Use real Stripe price ID (from plan)
      const priceId = params.isYearly ? plan.stripeYearlyPriceId : plan.stripePriceId;
      
      if (!priceId) {
        return {
          success: false,
          message: `No Stripe price configured for ${plan.name} (${params.isYearly ? 'yearly' : 'monthly'})`
        };
      }

      // Create checkout session
      const { createCheckoutSession } = await import('@/lib/payments/stripe-client');
      const session = await createCheckoutSession({
        customerId: stripeCustomerId,
        priceId: priceId,
        successUrl: `${process.env.BASE_URL}/dashboard?subscription=success`,
        cancelUrl: `${process.env.BASE_URL}/pricing?subscription=cancelled`
      });

      return {
        success: true,
        message: 'Checkout session created',
        checkoutUrl: session.url
      };

    } catch (error) {
      console.error('Real Stripe subscription error:', error);
      return {
        success: false,
        message: 'Failed to create Stripe checkout session',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Internal method to cancel subscription without external validation
   */
  private static async cancelSubscriptionInternal(subscription: any): Promise<void> {
    // Cancel in Stripe (mock or real)
    if (subscription.stripeSubscriptionId) {
      await cancelSubscription(subscription.stripeSubscriptionId);
    }

    // Update in our database
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(subscription.userId, {
      subscriptionStatus: 'cancelled'
    });
  }

  /**
   * Cancel a user's subscription
   */
  static async cancelSubscription(userId: string): Promise<SubscriptionResult> {
    try {
      await connectDB();

      const userSubscription = await UserSubscription.findOne({
        userId,
        status: { $in: ['active', 'trialing'] }
      });

      if (!userSubscription) {
        return { success: false, message: 'No active subscription found' };
      }

      // Use internal cancellation method
      await this.cancelSubscriptionInternal(userSubscription);

      const logMessage = isMockStripe ? '(Mock Stripe)' : '(Real Stripe)';
      console.log(`✅ Subscription cancelled for user ${userId} ${logMessage}`);

      return {
        success: true,
        message: `Subscription cancelled successfully ${logMessage}`
      };

    } catch (error) {
      console.error('Cancel subscription error:', error);
      return {
        success: false,
        message: 'Failed to cancel subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Change user's plan (upgrade/downgrade)
   */
  static async changePlan(userId: string, newPlanId: string, isYearly?: boolean): Promise<SubscriptionResult> {
    try {
      await connectDB();

      // Simply subscribe to new plan - subscribeToPlan now handles existing subscriptions
      return await this.subscribeToPlan({
        userId,
        planId: newPlanId,
        isYearly
      });

    } catch (error) {
      console.error('Change plan error:', error);
      return {
        success: false,
        message: 'Failed to change plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user's current subscription status
   */
  static async getUserSubscription(userId: string) {
    try {
      await connectDB();

      const subscription = await UserSubscription.findOne({
        userId,
        status: { $in: ['active', 'trialing', 'cancelled'] }
      }).populate('planId').sort({ createdAt: -1 });

      return subscription;

    } catch (error) {
      console.error('Get user subscription error:', error);
      return null;
    }
  }

  /**
   * Check if user has access to a specific app
   */
  static async hasAppAccess(userId: string, appId: string): Promise<boolean> {
    try {
      await connectDB();

      const subscription = await this.getUserSubscription(userId);
      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      // Check if app is included in user's plan
      const { PlanApp } = await import('@/lib/db/schemas');
      const planApp = await PlanApp.findOne({
        planId: subscription.planId,
        appId: appId,
        isIncluded: true
      });

      return !!planApp;

    } catch (error) {
      console.error('Check app access error:', error);
      return false;
    }
  }

  /**
   * Get all apps user has access to
   */
  static async getUserApps(userId: string) {
    try {
      await connectDB();

      const subscription = await this.getUserSubscription(userId);
      if (!subscription || subscription.status !== 'active') {
        return [];
      }

      // Get all apps included in user's plan
      const { PlanApp, App } = await import('@/lib/db/schemas');
      const planApps = await PlanApp.find({
        planId: subscription.planId,
        isIncluded: true
      }).populate('appId');

      return planApps.map(pa => pa.appId).filter(Boolean);

    } catch (error) {
      console.error('Get user apps error:', error);
      return [];
    }
  }
}

export default SubscriptionManager;