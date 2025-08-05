import { connectDB } from './connection';
import { SubscriptionPlan, UserSubscription, PlanApp, App, User } from './schemas';

export async function seedSubscriptionData() {
  await connectDB();

  try {
    // Check if subscription plans already exist
    const existingPlans = await SubscriptionPlan.countDocuments();
    if (existingPlans > 0) {
      console.log('Subscription plans already exist, skipping seed...');
      return { success: true, message: 'Subscription data already seeded' };
    }

    console.log('🌱 Seeding subscription plans...');

    // Create subscription plans
    const plans = [
      {
        name: 'Free',
        slug: 'free',
        description: 'Perfect for getting started with basic apps',
        price: 0,
        yearlyPrice: 0,
        features: [
          'Access to 3 basic apps',
          'Up to 2 team members',
          '5GB storage',
          'Email support',
          'Basic analytics'
        ],
        maxUsers: 2,
        storageQuota: 5,
        position: 1,
        isPopular: false
      },
      {
        name: 'Starter',
        slug: 'starter',
        description: 'Great for small teams and growing businesses',
        price: 2900, // $29/month
        yearlyPrice: 29000, // $290/year (2 months free)
        features: [
          'Access to 8 business apps',
          'Up to 10 team members',
          '50GB storage',
          'Priority email support',
          'Advanced analytics',
          'Custom integrations',
          'Mobile app access'
        ],
        maxUsers: 10,
        storageQuota: 50,
        position: 2,
        isPopular: true
      },
      {
        name: 'Professional',
        slug: 'professional',
        description: 'Ideal for established businesses with advanced needs',
        price: 7900, // $79/month
        yearlyPrice: 79000, // $790/year (2 months free)
        features: [
          'Access to ALL apps including AI',
          'Up to 50 team members',
          '500GB storage',
          'Phone + email support',
          'Advanced analytics & reporting',
          'Custom integrations',
          'Mobile app access',
          'AI-powered insights',
          'Advanced workflow automation',
          'Custom branding'
        ],
        maxUsers: 50,
        storageQuota: 500,
        position: 3,
        isPopular: false
      },
      {
        name: 'Enterprise',
        slug: 'enterprise',
        description: 'For large organizations with custom requirements',
        price: 19900, // $199/month
        yearlyPrice: 199000, // $1990/year (2 months free)
        features: [
          'Everything in Professional',
          'Unlimited team members',
          'Unlimited storage',
          'Dedicated account manager',
          '24/7 phone support',
          'Custom development',
          'On-premise deployment options',
          'Advanced security features',
          'SLA guarantees',
          'Custom training'
        ],
        maxUsers: -1, // Unlimited
        storageQuota: -1, // Unlimited
        position: 4,
        isPopular: false
      }
    ];

    const createdPlans = await SubscriptionPlan.insertMany(plans);
    console.log(`✅ Created ${createdPlans.length} subscription plans`);

    // Create sample apps if they don't exist
    const existingApps = await App.countDocuments();
    if (existingApps === 0) {
      console.log('🌱 Seeding sample apps...');
      
      const sampleApps = [
        {
          name: 'CRM & Sales',
          slug: 'crm',
          ssoUrl: 'https://crm.example.com/auth/sso',
          description: 'Manage customer relationships and sales pipeline',
          status: 'active',
          icon: 'TrendingUp',
          color: 'bg-blue-500',
          requiresPlan: false,
          minimumPlanLevel: 0,
          category: 'sales'
        },
        {
          name: 'Finance & Accounting',
          slug: 'finance',
          ssoUrl: 'https://finance.example.com/auth/sso',
          description: 'Complete financial management and accounting',
          status: 'active',
          icon: 'CreditCard',
          color: 'bg-green-500',
          requiresPlan: false,
          minimumPlanLevel: 0,
          category: 'finance'
        },
        {
          name: 'Email Marketing',
          slug: 'email',
          ssoUrl: 'https://email.example.com/auth/sso',
          description: 'Create and send professional email campaigns',
          status: 'active',
          icon: 'Mail',
          color: 'bg-purple-500',
          requiresPlan: false,
          minimumPlanLevel: 0,
          category: 'marketing'
        },
        {
          name: 'Project Management',
          slug: 'projects',
          ssoUrl: 'https://projects.example.com/auth/sso',
          description: 'Plan, track, and manage team projects',
          status: 'active',
          icon: 'Briefcase',
          color: 'bg-orange-500',
          requiresPlan: true,
          minimumPlanLevel: 1,
          category: 'productivity'
        },
        {
          name: 'HR Management',
          slug: 'hr',
          ssoUrl: 'https://hr.example.com/auth/sso',
          description: 'Human resources and employee management',
          status: 'active',
          icon: 'Users',
          color: 'bg-pink-500',
          requiresPlan: true,
          minimumPlanLevel: 1,
          category: 'hr'
        },
        {
          name: 'Customer Support',
          slug: 'support',
          ssoUrl: 'https://support.example.com/auth/sso',
          description: 'Help desk and customer support platform',
          status: 'active',
          icon: 'MessageSquare',
          color: 'bg-teal-500',
          requiresPlan: true,
          minimumPlanLevel: 1,
          category: 'support'
        },
        {
          name: 'Analytics Dashboard',
          slug: 'analytics',
          ssoUrl: 'https://analytics.example.com/auth/sso',
          description: 'Advanced business intelligence and analytics',
          status: 'active',
          icon: 'BarChart3',
          color: 'bg-indigo-500',
          requiresPlan: true,
          minimumPlanLevel: 1,
          category: 'analytics'
        },
        {
          name: 'Document Management',
          slug: 'documents',
          ssoUrl: 'https://docs.example.com/auth/sso',
          description: 'Store, organize, and share documents securely',
          status: 'active',
          icon: 'FileText',
          color: 'bg-gray-500',
          requiresPlan: true,
          minimumPlanLevel: 1,
          category: 'productivity'
        },
        {
          name: 'AI Assistant Pro',
          slug: 'ai-assistant',
          ssoUrl: 'https://ai.example.com/auth/sso',
          description: 'Advanced AI-powered business assistant',
          status: 'active',
          icon: 'Zap',
          color: 'bg-yellow-500',
          requiresPlan: true,
          minimumPlanLevel: 2,
          category: 'ai'
        },
        {
          name: 'Advanced Automation',
          slug: 'automation',
          ssoUrl: 'https://automation.example.com/auth/sso',
          description: 'Workflow automation and business process management',
          status: 'active',
          icon: 'Settings',
          color: 'bg-red-500',
          requiresPlan: true,
          minimumPlanLevel: 2,
          category: 'automation'
        },
        {
          name: 'Custom Reporting',
          slug: 'reporting',
          ssoUrl: 'https://reports.example.com/auth/sso',
          description: 'Create custom reports and dashboards',
          status: 'active',
          icon: 'BarChart3',
          color: 'bg-cyan-500',
          requiresPlan: true,
          minimumPlanLevel: 2,
          category: 'analytics'
        },
        {
          name: 'Enterprise Security',
          slug: 'security',
          ssoUrl: 'https://security.example.com/auth/sso',
          description: 'Advanced security monitoring and compliance',
          status: 'active',
          icon: 'Shield',
          color: 'bg-slate-500',
          requiresPlan: true,
          minimumPlanLevel: 3,
          category: 'security'
        }
      ];

      const createdApps = await App.insertMany(sampleApps);
      console.log(`✅ Created ${createdApps.length} sample apps`);

      // Create plan-app relationships
      console.log('🌱 Creating plan-app relationships...');
      
      const planAppRelationships = [];
      
      // Free plan: Basic apps only (first 3 apps)
      const freePlan = createdPlans.find(p => p.slug === 'free');
      for (let i = 0; i < 3; i++) {
        planAppRelationships.push({
          planId: freePlan!._id.toString(),
          appId: createdApps[i]._id.toString(),
          isIncluded: true
        });
      }

      // Starter plan: First 8 apps
      const starterPlan = createdPlans.find(p => p.slug === 'starter');
      for (let i = 0; i < 8; i++) {
        planAppRelationships.push({
          planId: starterPlan!._id.toString(),
          appId: createdApps[i]._id.toString(),
          isIncluded: true
        });
      }

      // Professional plan: All apps except enterprise-only
      const proPlan = createdPlans.find(p => p.slug === 'professional');
      for (let i = 0; i < createdApps.length - 1; i++) { // All except last one
        planAppRelationships.push({
          planId: proPlan!._id.toString(),
          appId: createdApps[i]._id.toString(),
          isIncluded: true
        });
      }

      // Enterprise plan: All apps
      const enterprisePlan = createdPlans.find(p => p.slug === 'enterprise');
      for (const app of createdApps) {
        planAppRelationships.push({
          planId: enterprisePlan!._id.toString(),
          appId: app._id.toString(),
          isIncluded: true
        });
      }

      await PlanApp.insertMany(planAppRelationships);
      console.log(`✅ Created ${planAppRelationships.length} plan-app relationships`);
    }

    // Assign free plan to existing users if they don't have a plan
    const usersWithoutPlan = await User.find({ 
      currentPlanId: { $exists: false },
      subscriptionStatus: { $exists: false }
    });

    if (usersWithoutPlan.length > 0) {
      console.log(`🌱 Assigning free plan to ${usersWithoutPlan.length} existing users...`);
      
      const freePlan = createdPlans.find(p => p.slug === 'free');
      
      // Update users with free plan
      await User.updateMany(
        { 
          currentPlanId: { $exists: false },
          subscriptionStatus: { $exists: false }
        },
        {
          currentPlanId: freePlan!._id.toString(),
          subscriptionStatus: 'active'
        }
      );

      // Create user subscriptions for existing users
      const userSubscriptions = usersWithoutPlan.map(user => ({
        userId: user._id.toString(),
        planId: freePlan!._id.toString(),
        status: 'active',
        startDate: new Date(),
        isYearly: false
      }));

      await UserSubscription.insertMany(userSubscriptions);
      console.log(`✅ Created subscriptions for ${userSubscriptions.length} existing users`);
    }

    return { 
      success: true, 
      message: 'Subscription data seeded successfully',
      plansCreated: createdPlans.length
    };

  } catch (error) {
    console.error('❌ Error seeding subscription data:', error);
    return { 
      success: false, 
      message: `Error seeding data: ${error}`,
      error 
    };
  }
}