'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Trash2,
  Search,
  Crown,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface App {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  requiresPlan: boolean;
  minimumPlanLevel?: number;
  color?: string;
}

interface Plan {
  _id: string;
  name: string;
  slug: string;
  position: number;
}

interface PlanApp {
  _id: string;
  planId: string;
  appId: string;
  isIncluded: boolean;
}

export default function PlanAppsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [planApps, setPlanApps] = useState<PlanApp[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch plans
      const plansResponse = await fetch('/api/admin/plans');
      const plansData = await plansResponse.json();
      
      // Fetch apps
      const appsResponse = await fetch('/api/admin/apps');
      const appsData = await appsResponse.json();
      
      // Fetch plan-app relationships
      const planAppsResponse = await fetch('/api/admin/plan-apps');
      const planAppsData = await planAppsResponse.json();

      // Debug logging
      console.log('Plans Response:', plansData);
      console.log('Apps Response:', appsData);
      console.log('PlanApps Response:', planAppsData);

      // Plans API returns { plans: [...], allApps: [...], totalPlans: N }
      if (plansData.plans) setPlans(plansData.plans || []);
      // Apps API returns { success: true, apps: [...] }
      if (appsData.success) setApps(appsData.apps || []);
      // Plan-Apps API returns { success: true, planApps: [...] }
      if (planAppsData.success) setPlanApps(planAppsData.planApps || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const addAppToPlan = async (planId: string, appId: string) => {
    try {
      const response = await fetch('/api/admin/plan-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, appId, isIncluded: true })
      });

      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        alert('Error adding app to plan');
      }
    } catch (error) {
      alert('Error adding app to plan');
    }
  };

  const removeAppFromPlan = async (planAppId: string) => {
    try {
      const response = await fetch(`/api/admin/plan-apps/${planAppId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        alert('Error removing app from plan');
      }
    } catch (error) {
      alert('Error removing app from plan');
    }
  };

  const getAppsForPlan = (planId: string) => {
    const includedAppIds = planApps
      .filter(pa => pa.planId === planId && pa.isIncluded)
      .map(pa => pa.appId);
    
    return apps.filter(app => includedAppIds.includes(app._id));
  };

  const getAvailableAppsForPlan = (planId: string) => {
    const includedAppIds = planApps
      .filter(pa => pa.planId === planId && pa.isIncluded)
      .map(pa => pa.appId);
    
    return apps.filter(app => 
      !includedAppIds.includes(app._id) &&
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getPlanAppId = (planId: string, appId: string) => {
    const planApp = planApps.find(pa => pa.planId === planId && pa.appId === appId);
    return planApp?._id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manage Plan Apps</h2>
        <p className="text-gray-600">Add and remove apps from subscription plans</p>
      </div>

      {/* Plan Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Select Plan:</label>
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a plan...</option>
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.name} (Level {plan.position})
            </option>
          ))}
        </select>
      </div>

      {selectedPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Apps in Selected Plan */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Apps in {plans.find(p => p._id === selectedPlan)?.name}
            </h3>
            
            <div className="space-y-3">
              {getAppsForPlan(selectedPlan).map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${app.color || 'bg-blue-500'} flex items-center justify-center text-white text-sm font-medium`}>
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{app.name}</div>
                      <div className="text-sm text-gray-500">{app.shortDescription || app.description}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const planAppId = getPlanAppId(selectedPlan, app._id);
                      if (planAppId) removeAppFromPlan(planAppId);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {getAppsForPlan(selectedPlan).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No apps in this plan yet
                </div>
              )}
            </div>
          </Card>

          {/* Available Apps */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Apps</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getAvailableAppsForPlan(selectedPlan).map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${app.color || 'bg-blue-500'} flex items-center justify-center text-white text-sm font-medium`}>
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{app.name}</span>
                        {app.requiresPlan && (
                          <Badge variant="outline" className="text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Lvl {app.minimumPlanLevel}+
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{app.shortDescription || app.description}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addAppToPlan(selectedPlan, app._id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {getAvailableAppsForPlan(selectedPlan).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No apps match your search' : 'All apps are already in this plan'}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Plans</div>
              <div className="text-lg font-semibold">{plans.length}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Apps</div>
              <div className="text-lg font-semibold">{apps.length}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <XCircle className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Plan-App Links</div>
              <div className="text-lg font-semibold">{planApps.length}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}