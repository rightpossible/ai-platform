import { auth0 } from '@/lib/auth0';
import { getUserByAuth0Id } from '@/lib/auth/user-sync';
import { connectDB } from '@/lib/db/connection';
import { SubscriptionPlan, PlanApp, App } from '@/lib/db/schemas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Star, 
  Users, 
  HardDrive, 
  Plus,
  Settings,
  Database
} from 'lucide-react';

export default async function PlansAdminPage() {
  const session = await auth0.getSession();
  const user = await getUserByAuth0Id(session!.user.sub);
  
  await connectDB();
  
  // Get all plans with app relationships
  const plans = await SubscriptionPlan.find({ isActive: true })
    .sort({ position: 1 })
    .lean();
  
  const planApps = await PlanApp.find({})
    .populate('appId')
    .lean();
  
  const allApps = await App.find({ status: 'active' }).lean();
  
  // Group apps by plan
  const planAppMap = new Map();
  planApps.forEach(pa => {
    if (!planAppMap.has(pa.planId.toString())) {
      planAppMap.set(pa.planId.toString(), []);
    }
    if (pa.isIncluded && pa.appId) {
      planAppMap.get(pa.planId.toString()).push(pa.appId);
    }
  });

  async function handleSeedData() {
    'use server';
    
    const { seedSubscriptionData } = await import('@/lib/db/seed-subscriptions');
    await seedSubscriptionData();
  }

  async function handleFixRoles() {
    'use server';
    
    const { fixUserRoles } = await import('@/lib/db/fix-user-roles');
    await fixUserRoles();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-gray-600">Manage subscription plans and app access</p>
        </div>
        
        <div className="flex gap-3">
          <form action={handleFixRoles}>
            <Button type="submit" variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Fix User Roles
            </Button>
          </form>
          
          <form action={handleSeedData}>
            <Button type="submit" variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Seed Sample Data
            </Button>
          </form>
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        </div>
      </div>

      {/* Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const planId = (plan._id as string).toString();
          const includedApps = planAppMap.get(planId) || [];
          
          return (
            <Card key={planId} className={`p-6 relative ${plan.isPopular ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {plan.price === 0 ? 'Free' : `$${(plan.price / 100).toFixed(0)}`}
                    {plan.price > 0 && <span className="text-sm font-normal text-gray-600">/month</span>}
                  </div>
                  
                  {plan.yearlyPrice && plan.yearlyPrice > 0 && (
                    <div className="text-sm text-green-600">
                      Save ${((plan.price * 12 - plan.yearlyPrice) / 100).toFixed(0)} yearly
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
                  <div className="text-sm font-medium">Included Apps ({includedApps.length})</div>
                  <div className="space-y-1">
                    {allApps.slice(0, 3).map((app) => {
                      const appId = (app._id as string).toString();
                      const isIncluded = includedApps.some((ia: any) => (ia._id as string).toString() === appId);
                      return (
                        <div key={appId} className="flex items-center gap-2 text-xs">
                          {isIncluded ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-gray-400" />
                          )}
                          <span className={isIncluded ? 'text-gray-900' : 'text-gray-400'}>
                            {app.name}
                          </span>
                        </div>
                      );
                    })}
                    {allApps.length > 3 && (
                      <div className="text-xs text-gray-500">
                        + {allApps.length - 3} more apps
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold">{plans.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Apps</p>
              <p className="text-2xl font-bold">{allApps.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Popular Plan</p>
              <p className="text-lg font-bold">{plans.find(p => p.isPopular)?.name || 'None'}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Price Range</p>
              <p className="text-lg font-bold">
                ${Math.min(...plans.filter(p => p.price > 0).map(p => p.price / 100))} - 
                ${Math.max(...plans.map(p => p.price / 100))}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* All Apps List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">All Available Apps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allApps.map((app) => (
            <div key={(app._id as string).toString()} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className={`p-2 rounded-lg ${app.color || 'bg-gray-100'}`}>
                <Database className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{app.name}</div>
                <div className="text-sm text-gray-500">{app.category}</div>
              </div>
              <Badge variant={app.requiresPlan ? 'default' : 'secondary'}>
                {app.requiresPlan ? 'Paid' : 'Free'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}