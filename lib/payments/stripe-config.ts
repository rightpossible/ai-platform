// Stripe configuration - easily switch between mock and real Stripe

// Force mock stripe with env var, or use mock in development by default
const USE_MOCK_STRIPE = process.env.USE_MOCK_STRIPE === 'true' || 
  (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_STRIPE !== 'false');

// Real Stripe configuration
const REAL_STRIPE_CONFIG = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
};

// Mock Stripe configuration
const MOCK_STRIPE_CONFIG = {
  secretKey: 'mock_stripe_secret_key',
  publishableKey: 'mock_stripe_publishable_key',
  webhookSecret: 'mock_stripe_webhook_secret',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
};

export const stripeConfig = USE_MOCK_STRIPE ? MOCK_STRIPE_CONFIG : REAL_STRIPE_CONFIG;
export const isMockStripe = USE_MOCK_STRIPE;

// Log which Stripe we're using
if (USE_MOCK_STRIPE) {
  console.log('🎭 Using Mock Stripe for development');
} else {
  console.log('💳 Using Real Stripe for production');
}

export default stripeConfig;