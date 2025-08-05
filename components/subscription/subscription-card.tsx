'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Users, 
  HardDrive, 
  Check, 
  X,
  Loader2,
  CreditCard,
  Calendar
} from 'lucide-react';

interface SubscriptionPlan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  yearlyPrice?: number;
  features: string[];
  maxUsers: number;
  storageQuota: number;
  isPopular?: boolean;
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSubscribe?: (planId: string, isYearly: boolean) => Promise<void>;
  isLoading?: boolean;
  userSubscription?: any;
}

export function SubscriptionCard({ 
  plan, 
  isCurrentPlan, 
  onSubscribe, 
  isLoading,
  userSubscription
}: SubscriptionCardProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!onSubscribe || isCurrentPlan) return;
    
    setSubscribing(true);
    try {
      await onSubscribe(plan._id, billingCycle === 'yearly');
    } finally {
      setSubscribing(false);
    }
  };

  const currentPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;
  const savings = plan.yearlyPrice ? 
    ((plan.price * 12 - plan.yearlyPrice) / 100) : 0;

  return (
    <Card className={`p-6 relative ${plan.isPopular ? 'ring-2 ring-blue-500' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      {plan.isPopular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white flex items-center gap-1">
            <Star className="h-3 w-3" />
            Popular
          </Badge>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <Check className="h-3 w-3" />
            Current Plan
          </Badge>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
        </div>
        
        {/* Billing toggle for paid plans */}
        {plan.price > 0 && plan.yearlyPrice && (
          <div className="flex items-center justify-center p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                billingCycle === 'yearly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {currentPrice === 0 ? 'Free' : `$${(currentPrice || 0 / 100).toFixed(0)}`}
            {currentPrice && currentPrice > 0 && (
              <span className="text-sm font-normal text-gray-600">
                /{billingCycle === 'yearly' ? 'year' : 'month'}
              </span>
            )}
          </div>
          {savings > 0 && billingCycle === 'yearly' && (
            <div className="text-sm text-green-600 font-medium">
              Save ${savings.toFixed(0)} per year
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers} users</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <HardDrive className="h-4 w-4 text-gray-500" />
            <span>{plan.storageQuota === -1 ? 'Unlimited' : `${plan.storageQuota}GB`} storage</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Features</div>
          <div className="space-y-1">
            {plan.features.slice(0, 5).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-xs">
                <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
            {plan.features.length > 5 && (
              <div className="text-xs text-gray-500">
                + {plan.features.length - 5} more features
              </div>
            )}
          </div>
        </div>
        
        {/* Current subscription info */}
        {isCurrentPlan && userSubscription && (
          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>
                {userSubscription.status === 'trialing' ? 'Trial until' : 'Renews'}: {' '}
                {new Date(userSubscription.trialEndsAt || userSubscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
            {userSubscription.status === 'trialing' && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Free Trial
              </Badge>
            )}
          </div>
        )}
        
                 <div className="pt-4">
           {isCurrentPlan ? (
             <div className="space-y-2">
               <Button disabled className="w-full" variant="outline">
                 <Check className="h-4 w-4 mr-2" />
                 Current Plan
               </Button>
               {userSubscription?.status === 'active' && (
                 <Button 
                   onClick={() => {
                     if (confirm('Are you sure you want to cancel your subscription?')) {
                       // Handle cancellation
                       fetch('/api/subscriptions/cancel', { method: 'POST' })
                         .then(response => response.json())
                         .then(data => {
                           if (data.success) {
                             alert('Subscription cancelled successfully');
                             window.location.reload();
                           } else {
                             alert(`Failed to cancel: ${data.message}`);
                           }
                         });
                     }
                   }}
                   variant="outline"
                   size="sm"
                   className="w-full text-red-600 hover:text-red-700"
                 >
                   Cancel Subscription
                 </Button>
               )}
             </div>
           ) : (
             <Button 
               onClick={handleSubscribe}
               disabled={subscribing || isLoading}
               className="w-full"
               variant={plan.isPopular ? 'default' : 'outline'}
             >
               {subscribing ? (
                 <>
                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                   {userSubscription ? 'Changing Plan...' : 'Subscribing...'}
                 </>
               ) : (
                 <>
                   <CreditCard className="h-4 w-4 mr-2" />
                   {userSubscription ? 
                     (userSubscription.planId?.price === 0 ? 'Upgrade Now' :
                      plan.price > (userSubscription.planId?.price || 0) ? 'Upgrade' : 'Change Plan') :
                     (plan.price === 0 ? 'Start Free' : 'Subscribe')
                   }
                 </>
               )}
             </Button>
           )}
         </div>
      </div>
    </Card>
  );
}