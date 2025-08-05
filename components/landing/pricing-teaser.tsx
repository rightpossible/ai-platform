import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Zap, Crown, Rocket } from 'lucide-react';

export function PricingTeaserSection() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses getting started",
      price: "$89",
      period: "per month",
      icon: Zap,
      features: [
        "5 Core AI Agents",
        "20 Business Modules",
        "Basic Analytics",
        "Email Support",
        "5 Team Members"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "bg-blue-500"
    },
    {
      name: "Professional",
      description: "Most popular for growing businesses",
      price: "$189",
      period: "per month",
      icon: Crown,
      features: [
        "All 8 AI Agent Types",
        "50+ Business Modules",
        "Advanced Analytics",
        "Priority Support",
        "25 Team Members",
        "Custom Integrations"
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "bg-primary"
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom needs",
      price: "Custom",
      period: "pricing",
      icon: Rocket,
      features: [
        "Unlimited AI Agents",
        "All 103+ Modules",
        "Custom Analytics",
        "Dedicated Support",
        "Unlimited Team Members",
        "White-label Options",
        "On-premise Deployment"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "bg-purple-500"
    }
  ];

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

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div 
                key={index}
                className={`bg-card border rounded-xl p-8 relative hover:shadow-lg transition-all duration-300 ${
                  plan.popular ? 'border-primary shadow-md scale-105' : 'border-border'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
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
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
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
                  className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

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
            <Button variant="outline">
              View All FAQ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}