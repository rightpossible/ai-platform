// Mock Stripe implementation for development
// Switch to real Stripe by changing the import in the main stripe.ts file

export interface MockStripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
}

export interface MockStripeSubscription {
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

export interface MockStripeProduct {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface MockStripePrice {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: 'month' | 'year';
  };
  active: boolean;
}

// In-memory storage for mock data
const mockCustomers = new Map<string, MockStripeCustomer>();
const mockSubscriptions = new Map<string, MockStripeSubscription>();
const mockProducts = new Map<string, MockStripeProduct>();
const mockPrices = new Map<string, MockStripePrice>();

// Generate mock IDs
const generateId = (prefix: string) => `${prefix}_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export class MockStripe {
  // Customer methods
  customers = {
    create: async (params: { email: string; name?: string }) => {
      const customer: MockStripeCustomer = {
        id: generateId('cus'),
        email: params.email,
        name: params.name || '',
        created: Math.floor(Date.now() / 1000)
      };
      mockCustomers.set(customer.id, customer);
      console.log(`🎭 Mock Stripe: Created customer ${customer.id} for ${customer.email}`);
      return customer;
    },

    retrieve: async (customerId: string) => {
      const customer = mockCustomers.get(customerId);
      if (!customer) {
        throw new Error(`Customer ${customerId} not found`);
      }
      return customer;
    }
  };

  // Product methods
  products = {
    create: async (params: { name: string; description?: string }) => {
      const product: MockStripeProduct = {
        id: generateId('prod'),
        name: params.name,
        description: params.description || '',
        active: true
      };
      mockProducts.set(product.id, product);
      console.log(`🎭 Mock Stripe: Created product ${product.id} - ${product.name}`);
      return product;
    },

    retrieve: async (productId: string) => {
      const product = mockProducts.get(productId);
      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }
      return product;
    },

    list: async () => {
      return {
        data: Array.from(mockProducts.values())
      };
    }
  };

  // Price methods
  prices = {
    create: async (params: {
      product: string;
      unit_amount: number;
      currency: string;
      recurring: { interval: 'month' | 'year' };
    }) => {
      const price: MockStripePrice = {
        id: generateId('price'),
        product: params.product,
        unit_amount: params.unit_amount,
        currency: params.currency,
        recurring: params.recurring,
        active: true
      };
      mockPrices.set(price.id, price);
      console.log(`🎭 Mock Stripe: Created price ${price.id} - $${params.unit_amount/100}/${params.recurring.interval}`);
      return price;
    },

    list: async (params?: { product?: string; active?: boolean }) => {
      let prices = Array.from(mockPrices.values());
      
      if (params?.product) {
        prices = prices.filter(p => p.product === params.product);
      }
      
      if (params?.active !== undefined) {
        prices = prices.filter(p => p.active === params.active);
      }

      return { data: prices };
    }
  };

  // Subscription methods
  subscriptions = {
    create: async (params: {
      customer: string;
      items: Array<{ price: string }>;
      trial_period_days?: number;
    }) => {
      const now = Math.floor(Date.now() / 1000);
      const subscription: MockStripeSubscription = {
        id: generateId('sub'),
        customer: params.customer,
        status: params.trial_period_days ? 'trialing' : 'active',
        current_period_start: now,
        current_period_end: now + (30 * 24 * 60 * 60), // 30 days
        cancel_at_period_end: false,
        items: {
          data: params.items.map(item => {
            let price = mockPrices.get(item.price);
            
            // Auto-create missing prices for mock price IDs
            if (!price && item.price.startsWith('price_mock_')) {
              console.log(`🎭 Mock Stripe: Auto-creating missing price ${item.price}`);
              
              // Parse price ID to extract plan details
              const parts = item.price.split('_');
              const planSlug = parts[2]; // e.g., 'starter'
              const interval = parts[3]; // e.g., 'monthly' or 'yearly'
              
              // Create mock product first
              const productId = `prod_mock_${planSlug}`;
              if (!mockProducts.has(productId)) {
                const product: MockStripeProduct = {
                  id: productId,
                  name: planSlug.charAt(0).toUpperCase() + planSlug.slice(1) + ' Plan',
                  description: `Mock ${planSlug} plan`,
                  active: true
                };
                mockProducts.set(productId, product);
              }
              
              // Estimate price based on plan (this is just for mock)
              const planPricingMap = {
                'starter': { monthly: 1900, yearly: 19000 }, // $19/month, $190/year
                'pro': { monthly: 4900, yearly: 49000 },     // $49/month, $490/year
                'enterprise': { monthly: 9900, yearly: 99000 } // $99/month, $990/year
              };
              
              const planPricing = planPricingMap[planSlug as keyof typeof planPricingMap] || { monthly: 1000, yearly: 10000 };
              const unitAmount = interval === 'yearly' ? planPricing.yearly : planPricing.monthly;
              
              price = {
                id: item.price,
                product: productId,
                unit_amount: unitAmount,
                currency: 'usd',
                recurring: { interval: interval === 'yearly' ? 'year' : 'month' },
                active: true
              };
              
              mockPrices.set(item.price, price);
              console.log(`🎭 Mock Stripe: Created price ${item.price} - $${unitAmount/100}/${price.recurring.interval}`);
            }
            
            if (!price) {
              throw new Error(`Price ${item.price} not found`);
            }
            return { price };
          })
        }
      };
      
      mockSubscriptions.set(subscription.id, subscription);
      console.log(`🎭 Mock Stripe: Created subscription ${subscription.id} for customer ${params.customer}`);
      return subscription;
    },

    retrieve: async (subscriptionId: string) => {
      const subscription = mockSubscriptions.get(subscriptionId);
      if (!subscription) {
        throw new Error(`Subscription ${subscriptionId} not found`);
      }
      return subscription;
    },

    update: async (subscriptionId: string, params: any) => {
      const subscription = mockSubscriptions.get(subscriptionId);
      if (!subscription) {
        throw new Error(`Subscription ${subscriptionId} not found`);
      }
      
      // Update subscription properties
      Object.assign(subscription, params);
      console.log(`🎭 Mock Stripe: Updated subscription ${subscriptionId}`);
      return subscription;
    },

    cancel: async (subscriptionId: string) => {
      const subscription = mockSubscriptions.get(subscriptionId);
      if (!subscription) {
        throw new Error(`Subscription ${subscriptionId} not found`);
      }
      
      subscription.status = 'canceled';
      subscription.cancel_at_period_end = true;
      console.log(`🎭 Mock Stripe: Canceled subscription ${subscriptionId}`);
      return subscription;
    }
  };

  // Checkout sessions (simplified)
  checkout = {
    sessions: {
      create: async (params: {
        customer?: string;
        success_url: string;
        cancel_url: string;
        line_items: Array<{
          price: string;
          quantity: number;
        }>;
        mode: 'subscription' | 'payment';
      }) => {
        const sessionId = generateId('cs');
        console.log(`🎭 Mock Stripe: Created checkout session ${sessionId}`);
        
        // In a real scenario, this would redirect to Stripe
        // For mock, we'll simulate immediate success
        return {
          id: sessionId,
          url: `${params.success_url}?session_id=${sessionId}&mock=true`
        };
      }
    }
  };

  // Billing portal (simplified)
  billingPortal = {
    configurations: {
      list: async () => {
        return {
          data: [{
            id: generateId('bpc'),
            business_profile: { headline: 'Mock Billing Portal' }
          }]
        };
      },

      create: async (params: any) => {
        console.log(`🎭 Mock Stripe: Created billing portal configuration`);
        return {
          id: generateId('bpc'),
          ...params
        };
      }
    },

    sessions: {
      create: async (params: {
        customer: string;
        return_url: string;
        configuration?: string;
      }) => {
        const sessionId = generateId('bps');
        console.log(`🎭 Mock Stripe: Created billing portal session ${sessionId}`);
        
        // For mock, redirect back immediately
        return {
          id: sessionId,
          url: `${params.return_url}?mock_portal=true`
        };
      }
    }
  };

  // Webhook simulation
  webhooks = {
    constructEvent: (payload: string, signature: string, secret: string) => {
      // Parse the mock webhook payload
      try {
        const event = JSON.parse(payload);
        console.log(`🎭 Mock Stripe: Received webhook ${event.type}`);
        return event;
      } catch (error) {
        throw new Error('Invalid webhook payload');
      }
    }
  };
}

// Export singleton instance
export const mockStripe = new MockStripe();

// Mock webhook events for testing
export const createMockWebhookEvent = (type: string, data: any) => {
  return {
    id: generateId('evt'),
    type,
    data: { object: data },
    created: Math.floor(Date.now() / 1000)
  };
};

// Helper to simulate common webhook events
export const simulateWebhookEvents = {
  subscriptionCreated: (subscription: MockStripeSubscription) => 
    createMockWebhookEvent('customer.subscription.created', subscription),
    
  subscriptionUpdated: (subscription: MockStripeSubscription) => 
    createMockWebhookEvent('customer.subscription.updated', subscription),
    
  subscriptionDeleted: (subscription: MockStripeSubscription) => 
    createMockWebhookEvent('customer.subscription.deleted', subscription),
    
  paymentSucceeded: (subscription: MockStripeSubscription) => 
    createMockWebhookEvent('invoice.payment_succeeded', {
      subscription: subscription.id,
      customer: subscription.customer
    }),
    
  paymentFailed: (subscription: MockStripeSubscription) => 
    createMockWebhookEvent('invoice.payment_failed', {
      subscription: subscription.id,
      customer: subscription.customer
    })
};

console.log('🎭 Mock Stripe system initialized - all payments will be simulated');