'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  HardDrive,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface SubscriptionStatusProps {
  onUpgrade?: () => void;
  onCancel?: () => void;
}

export function SubscriptionStatus({ onUpgrade, onCancel }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscriptions/status');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        setApps(data.apps || []);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    setCancelling(true);
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ ${result.message}`);
        await fetchSubscriptionStatus(); // Refresh data
        if (onCancel) onCancel();
      } else {
        const error = await response.json();
        alert(`Failed to cancel subscription: ${error.message}`);
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      alert('Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading subscription...</span>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <XCircle className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No Active Subscription</h3>
            <p className="text-gray-600">Choose a plan to get started</p>
          </div>
          {onUpgrade && (
            <Button onClick={onUpgrade}>
              View Plans
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'trialing': return <Calendar className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'past_due': return <AlertTriangle className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const plan = subscription.planId;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Current Subscription</h3>
            <p className="text-gray-600">Manage your subscription and billing</p>
          </div>
          <Badge className={getStatusColor(subscription.status)}>
            {getStatusIcon(subscription.status)}
            <span className="ml-1 capitalize">{subscription.status}</span>
          </Badge>
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">{plan?.name}</h4>
              <p className="text-sm text-gray-600">{plan?.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{plan?.maxUsers === -1 ? 'Unlimited' : plan?.maxUsers} users</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="h-4 w-4 text-gray-500" />
                <span>{plan?.storageQuota === -1 ? 'Unlimited' : `${plan?.storageQuota}GB`} storage</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Price: </span>
                {plan?.price === 0 ? 'Free' : `$${(plan?.price / 100)?.toFixed(0)}/month`}
              </div>
              
              {subscription.isYearly && plan?.yearlyPrice && (
                <div className="text-sm text-green-600">
                  Yearly billing - Save ${((plan.price * 12 - plan.yearlyPrice) / 100).toFixed(0)}/year
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Billing Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Started: </span>
                  {new Date(subscription.startDate).toLocaleDateString()}
                </div>
                
                {subscription.status === 'trialing' && subscription.trialEndsAt && (
                  <div>
                    <span className="text-gray-600">Trial ends: </span>
                    {new Date(subscription.trialEndsAt).toLocaleDateString()}
                  </div>
                )}
                
                {subscription.status === 'cancelled' && subscription.cancelledAt && (
                  <div>
                    <span className="text-gray-600">Cancelled: </span>
                    {new Date(subscription.cancelledAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Included Apps ({apps.length})</h4>
              <div className="space-y-1">
                {apps.slice(0, 3).map((app) => (
                  <div key={app._id} className="text-sm text-gray-600">
                    • {app.name}
                  </div>
                ))}
                {apps.length > 3 && (
                  <div className="text-sm text-gray-500">
                    + {apps.length - 3} more apps
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {onUpgrade && subscription.status === 'active' && (
            <Button onClick={onUpgrade} variant="outline">
              Change Plan
            </Button>
          )}
          
          {subscription.status === 'active' && plan?.price > 0 && (
            <Button 
              onClick={handleCancel}
              disabled={cancelling}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}