// Unified Stripe client that works with both mock and real Stripe

import { isMockStripe } from './stripe-config';

// Type definitions for compatibility
export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  created: number;
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      price: {
        id: string;
        product: string;
        unit_amount: number;
        recurring: {
          interval: 'month' | 'year';
        };
      };
    }>;
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface StripePrice {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: 'month' | 'year';
  };
  active: boolean;
}

// Import the appropriate Stripe implementation
let stripeClient: any;

if (isMockStripe) {
  // Use mock Stripe
  const { mockStripe } = await import('./mock-stripe');
  stripeClient = mockStripe;
} else {
  // Use real Stripe
  const Stripe = (await import('stripe')).default;
  const { stripeConfig } = await import('./stripe-config');
  stripeClient = new Stripe(stripeConfig.secretKey, {
    apiVersion: '2025-04-30.basil'
  });
}

export { stripeClient as stripe };

// Helper functions that work with both implementations
export const createCustomer = async (email: string, name?: string): Promise<StripeCustomer> => {
  return await stripeClient.customers.create({ email, name });
};

export const createSubscription = async (
  customerId: string, 
  priceId: string, 
  trialDays?: number
): Promise<StripeSubscription> => {
  return await stripeClient.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: trialDays
  });
};

export const cancelSubscription = async (subscriptionId: string): Promise<StripeSubscription> => {
  return await stripeClient.subscriptions.cancel(subscriptionId);
};

export const createCheckoutSession = async (params: {
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'subscription' | 'payment';
}) => {
  return await stripeClient.checkout.sessions.create({
    customer: params.customerId,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    line_items: [{
      price: params.priceId,
      quantity: 1
    }],
    mode: params.mode || 'subscription'
  });
};

export const createBillingPortalSession = async (customerId: string, returnUrl: string) => {
  return await stripeClient.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  });
};

// Webhook verification
export const verifyWebhook = (payload: string, signature: string, secret: string) => {
  return stripeClient.webhooks.constructEvent(payload, signature, secret);
};