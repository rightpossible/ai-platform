'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Zap, Crown, Rocket, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PricingTeaserSection() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      if (response.ok) {
        const data = await response.json();
        // Transform our database plans to display format
        const transformedPlans = data.plans?.slice(1, 4).map((plan: any, index: number) => ({
          ...plan,
          displayPrice: plan.price === 0 ? 'Free' : `$${(plan.price / 100).toFixed(0)}`,
          period: 'per month',
          icon: index === 0 ? Zap : index === 1 ? Crown : Rocket,
          cta: plan.price === 0 ? 'Start Free' : 'Start Free Trial',
          color: index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-primary' : 'bg-purple-500'
        })) || [];
        setPlans(transformedPlans);
      } else {
        // Fallback to static plans if API fails
        setPlans([
          {
            name: "Starter",
            description: "Perfect for small businesses getting started",
            displayPrice: "$29",
            period: "per month",
            icon: Zap,
            features: [
              "8 Business Apps",
              "10 Team Members",
              "50GB Storage",
              "Email Support",
              "Basic Analytics"
            ],
            cta: "Start Free Trial",
            isPopular: false,
            color: "bg-blue-500"
          },
          {
            name: "Professional",
            description: "Most popular for growing businesses",
            displayPrice: "$79",
            period: "per month",
            icon: Crown,
            features: [
              "All Apps + AI Features",
              "50 Team Members",
              "500GB Storage",
              "Priority Support",
              "Advanced Analytics",
              "Custom Integrations"
            ],
            cta: "Start Free Trial",
            isPopular: true,
            color: "bg-primary"
          },
          {
            name: "Enterprise",
            description: "For large organizations with custom needs",
            displayPrice: "$199",
            period: "per month",
            icon: Rocket,
            features: [
              "Everything in Professional",
              "Unlimited Team Members",
              "Unlimited Storage",
              "24/7 Phone Support",
              "Custom Development",
              "On-premise Options"
            ],
            cta: "Contact Sales",
            isPopular: false,
            color: "bg-purple-500"
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    router.push('/pricing');
  };

  return (
    <section className="py-16 bg-muted/30" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Replace $500-2000/month in tool subscriptions with one affordable platform. 
            Start with a 14-day free trial, no credit card required.
          </p>
          
          {/* Savings Calculator */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 max-w-2xl mx-auto mb-12">
            <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">
              💰 Potential Savings Calculator
            </h3>
            <div className="text-sm text-green-600 dark:text-green-400">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-bold">Current Tools Cost</div>
                  <div className="text-lg">$500-2000/month</div>
                </div>
                <div>
                  <div className="font-bold">Our Platform</div>
                  <div className="text-lg">$89-189/month</div>
                </div>
                <div>
                  <div className="font-bold">Your Savings</div>
                  <div className="text-lg">$400-1800/month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading pricing plans...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <div 
                  key={plan._id || index}
                  className={`bg-card border rounded-xl p-8 relative hover:shadow-lg transition-all duration-300 ${
                    plan.isPopular ? 'border-primary shadow-md scale-105' : 'border-border'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-lg ${plan.color} text-white mb-4`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold text-foreground">
                        {plan.displayPrice}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).slice(0, 6).map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button 
                    onClick={handleGetStarted}
                    className={`w-full ${plan.isPopular ? '' : 'variant-outline'}`}
                    variant={plan.isPopular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-foreground mb-4">✨ What's Included in All Plans</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 14-day free trial, no credit card required</li>
              <li>• 99.9% uptime SLA guarantee</li>
              <li>• SOC 2 & GDPR compliance</li>
              <li>• Mobile apps for iOS and Android</li>
              <li>• Regular feature updates and improvements</li>
              <li>• Migration assistance from existing tools</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-foreground mb-4">🚀 Implementation & Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Free setup and configuration assistance</li>
              <li>• Data migration from existing tools</li>
              <li>• Team training and onboarding</li>
              <li>• 24/7 technical support (Pro & Enterprise)</li>
              <li>• Dedicated success manager (Enterprise)</li>
              <li>• Custom integrations available</li>
            </ul>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-medium text-foreground mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yes, absolutely. No long-term contracts or cancellation fees. 
                Cancel with one click from your dashboard.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-medium text-foreground mb-2">
                Do you offer discounts for annual billing?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yes! Save 20% when you pay annually. All plans include 
                this discount option.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Button variant="outline" onClick={handleGetStarted}>
              View All Plans & Pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}