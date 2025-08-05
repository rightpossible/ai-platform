'use client';

import { useState, useEffect } from 'react';
import { SubscriptionCard } from '@/components/subscription/subscription-card';
import { SubscriptionStatus } from '@/components/subscription/subscription-status';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [showStatus, setShowStatus] = useState(true); // Show by default

  useEffect(() => {
    fetchPlans();
    fetchUserSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch('/api/subscriptions/status');
      if (response.ok) {
        const data = await response.json();
        setUserSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch user subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string, isYearly: boolean) => {
    setSubscribing(true);
    try {
      const response = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId, isYearly })
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message
        alert(result.message);
        
        // Refresh subscription data
        await fetchUserSubscription();
        
        // If it's a real Stripe checkout, redirect
        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        }
      } else {
        alert(`Subscription failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Failed to process subscription');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading pricing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Choose Your Plan</h1>
                <p className="text-gray-600">Select the perfect plan for your business needs</p>
              </div>
            </div>
            
            {userSubscription && (
              <Button
                variant="outline"
                onClick={() => setShowStatus(!showStatus)}
              >
                {showStatus ? 'Hide' : 'Show'} Subscription Details
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Subscription Status */}
        {userSubscription && (
          <div className="mb-8">
            {showStatus ? (
              <SubscriptionStatus 
                onUpgrade={() => setShowStatus(false)}
                onCancel={() => fetchUserSubscription()}
              />
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-800">
                  Current Plan: <strong>{userSubscription.planId?.name}</strong> 
                  ({userSubscription.planId?.price === 0 ? 'Free' : `$${(userSubscription.planId?.price / 100)?.toFixed(0)}/month`})
                </p>
                <Button 
                  variant="link" 
                  onClick={() => setShowStatus(true)}
                  className="text-blue-600"
                >
                  View details
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Mock Stripe Notice */}
        <Card className="p-4 mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <Sparkles className="h-5 w-5" />
            <div>
              <p className="font-medium">Development Mode</p>
              <p className="text-sm">
                You're using Mock Stripe - no real payments will be processed. 
                All subscriptions are simulated for testing purposes.
              </p>
            </div>
          </div>
        </Card>

        {/* Free Plan Upgrade Notice */}
        {userSubscription?.planId?.price === 0 && (
          <Card className="p-4 mb-8 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Seamless Upgrade Available</p>
                <p className="text-sm">
                  You're on the free plan. You can upgrade to any paid plan instantly - no cancellation needed!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = userSubscription?.planId?._id === plan._id;
            
            return (
              <SubscriptionCard
                key={plan._id}
                plan={plan}
                isCurrentPlan={isCurrentPlan}
                onSubscribe={handleSubscribe}
                isLoading={subscribing}
                userSubscription={userSubscription}
              />
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Compare Plans</h2>
            <p className="text-gray-600 mt-2">See what's included in each plan</p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    {plans.map((plan) => (
                      <th key={plan._id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Monthly Price
                    </td>
                    {plans.map((plan) => (
                      <td key={plan._id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {plan.price === 0 ? 'Free' : `$${(plan.price / 100).toFixed(0)}`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Users
                    </td>
                    {plans.map((plan) => (
                      <td key={plan._id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Storage
                    </td>
                    {plans.map((plan) => (
                      <td key={plan._id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {plan.storageQuota === -1 ? 'Unlimited' : `${plan.storageQuota}GB`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Apps Included
                    </td>
                    {plans.map((plan) => (
                      <td key={plan._id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {plan.appCount || 0} apps
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected immediately.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Is this real billing?</h3>
              <p className="text-gray-600 text-sm">
                Currently in development mode with mock payments. No real charges will be made to your card.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">What happens to my data?</h3>
              <p className="text-gray-600 text-sm">
                Your data is safe and secure. Downgrading may limit access to some features but won't delete your data.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">
                Yes, we offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}