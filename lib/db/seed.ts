import { stripe } from '../payments/stripe';
import { connectDB } from './mongodb';
import { User, Team, TeamMember } from './schemas';
import { hashPassword } from '@/lib/auth/session';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  await connectDB();

  const user = new User({
    email: email,
    passwordHash: passwordHash,
    role: "owner",
  });

  await user.save();
  console.log('Initial user created.');

  const team = new Team({
    name: 'Test Team',
  });

  await team.save();

  const teamMember = new TeamMember({
    teamId: team._id.toString(),
    userId: user._id.toString(),
    role: 'owner',
  });

  await teamMember.save();

  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
