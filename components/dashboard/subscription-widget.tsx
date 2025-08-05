'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  ArrowUpRight, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  Sparkles
} from 'lucide-react';

export function SubscriptionWidget() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscriptions/status');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'trialing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'past_due': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'trialing': return <Sparkles className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      case 'past_due': return <AlertTriangle className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading subscription...</span>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Choose Your Plan</h3>
              <p className="text-sm text-gray-600">Get access to premium features</p>
            </div>
            <CreditCard className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="text-sm text-gray-600">
            You're currently on the free plan with limited access.
          </div>
          
          <Button 
            onClick={() => router.push('/pricing')}
            className="w-full"
            size="sm"
          >
            View Plans
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    );
  }

  const plan = subscription.planId;
  
  // Debug logging
  console.log('Subscription data:', subscription);
  console.log('Plan data:', plan);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Current Plan</h3>
            <p className="text-sm text-gray-600">{plan?.name}</p>
          </div>
          <Badge className={getStatusColor(subscription.status)}>
            {getStatusIcon(subscription.status)}
            <span className="ml-1 capitalize">{subscription.status}</span>
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">
              {plan?.price === 0 ? 'Free' : `$${(plan?.price / 100)?.toFixed(0)}/month`}
            </span>
          </div>
          
          {subscription.status === 'trialing' && subscription.trialEndsAt && (
            <div className="flex justify-between">
              <span className="text-gray-600">Trial ends:</span>
              <span className="font-medium">
                {new Date(subscription.trialEndsAt).toLocaleDateString()}
              </span>
            </div>
          )}
          
          {subscription.isYearly && (
            <div className="flex justify-between">
              <span className="text-gray-600">Billing:</span>
              <span className="font-medium text-green-600">Yearly (Save 20%)</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => router.push('/pricing')}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Manage
          </Button>
          
          {subscription.status === 'active' && plan?.price > 0 && (
            <Button 
              onClick={() => router.push('/pricing')}
              size="sm"
              className="flex-1"
            >
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}