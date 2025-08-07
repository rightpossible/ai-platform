'use client';

import { useState, useEffect } from 'react';
import { useSSO } from '@/hooks/use-sso';
import { useErpNext } from '@/hooks/use-erpnext';
import { PasswordDialog } from '@/components/erpnext/password-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  CreditCard, 
  Users, 
  Mail,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  Building2,
  ShoppingCart,
  Phone,
  Code2,
  Database,
  Briefcase,
  Globe,
  Shield,
  Zap,
  MoreHorizontal,
  Play,
  Pause,
  ExternalLink,
  Lock,
  Crown,
  Star,
  Clock,
  CheckCircle,
  ArrowUpCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface CatalogApp {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  status: 'active' | 'inactive';
  color?: string;
  icon?: string;
  category?: string;
  tags?: string[];
  features?: string[];
  integrationStatus: 'ready' | 'beta' | 'coming_soon';
  popularity?: number;
  rating?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  requiresPlan: boolean;
  minimumPlanLevel?: number;
  hasAccess: boolean;
  accessReason: string;
  requiredPlanLevel?: number;
  userPlanLevel?: number;
}

interface AppGridProps {
  viewMode: 'grid' | 'list';
  filterBy?: string;
  searchQuery?: string;
}

interface UserSubscription {
  plan: {
    name: string;
    position: number;
  };
  status: string;
}

export function EnhancedAppGrid({ viewMode, filterBy = 'all', searchQuery = '' }: AppGridProps) {
  const [apps, setApps] = useState<CatalogApp[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { isLoading: ssoLoading, error, generateTokenAndRedirect, clearError } = useSSO();
  const { 
    isLoading: erpNextLoading, 
    isCreating: erpNextCreating, 
    error: erpNextError, 
    site: erpNextSite,
    checkExistingSite, 
    createSite, 
    openSite, 
    clearError: clearErpNextError 
  } = useErpNext();

  useEffect(() => {
    fetchAppCatalog();
  }, []);

  const fetchAppCatalog = async () => {
    try {
      const response = await fetch('/api/apps/catalog');
      if (response.ok) {
        const data = await response.json();
        setApps(data.apps || []);
        setUserSubscription(data.userSubscription);
      }
    } catch (error) {
      console.error('Error fetching app catalog:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter and search apps
  const filteredApps = apps.filter(app => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        app.name.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query) ||
        app.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        app.category?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filterBy === 'all') return true;
    if (filterBy === 'accessible') return app.hasAccess;
    if (filterBy === 'premium') return app.requiresPlan;
    if (filterBy === 'featured') return app.isFeatured;
    if (filterBy === 'popular') return app.isPopular;
    if (filterBy === 'category') return app.category === filterBy;
    
    return true;
  });

  const handleCreateErpNextSite = async (password: string) => {
    const site = await createSite({ password });
    if (site) {
      setShowPasswordDialog(false);
      // Show success message and redirect
      setTimeout(() => {
        if (site.status === 'active') {
          openSite(site.siteUrl);
        } else {
          alert('Your business platform is being created. You will receive an email when it\'s ready!');
        }
      }, 1000);
    }
  };

  const getAccessBadge = (app: CatalogApp) => {
    if (app.hasAccess) {
      if (app.accessReason === 'free') {
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">Free</Badge>;
      }
      return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Included</Badge>;
    }
    
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
      <Crown className="w-3 h-3 mr-1" />
      Upgrade Required
    </Badge>;
  };

  const getIntegrationStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="secondary" className="bg-green-50 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Ready</Badge>;
      case 'beta':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Beta</Badge>;
      case 'coming_soon':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700"><Clock className="w-3 h-3 mr-1" />Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const AppCard = ({ app }: { app: CatalogApp }) => {
    const IconComponent = Building2; // Default icon - in real app, map icon names to components
    
    const handleOpenApp = async () => {
      if (!app.hasAccess) {
        // Redirect to upgrade page
        window.location.href = '/pricing';
        return;
      }
      
      if (app.status !== 'active') {
        alert('This app is currently unavailable. Please try again later.');
        return;
      }
      
      // Special handling for ERPNext
      if (app.slug === 'erpnext-business-suite') {
        clearErpNextError();
        
        // Check if user already has an ERPNext site
        const existingSite = await checkExistingSite();
        if (existingSite && existingSite.status === 'active') {
          // User already has a site, open it
          openSite(existingSite.siteUrl);
          return;
        } else if (existingSite && existingSite.status === 'creating') {
          alert('Your business platform is still being created. Please check your email for updates.');
          return;
        }
        
        // User doesn't have a site, show password dialog
        setShowPasswordDialog(true);
        return;
      }
      
      // Regular app handling
      clearError();
      await generateTokenAndRedirect(app.slug);
    };
    
    if (viewMode === 'list') {
      return (
        <Card className="p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className={`p-3 rounded-lg ${app.color || 'bg-blue-500'} text-white relative`}>
                <IconComponent className="h-6 w-6" />
                {app.isFeatured && (
                  <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 fill-current" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground">{app.name}</h3>
                  {getAccessBadge(app)}
                  {getIntegrationStatusBadge(app.integrationStatus)}
                  {app.isPopular && <Badge variant="secondary" className="bg-purple-50 text-purple-700">Popular</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {app.shortDescription || app.description}
                </p>
                {app.tags && app.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {app.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {app.hasAccess ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenApp}
                  disabled={ssoLoading || erpNextLoading || app.status !== 'active' || app.integrationStatus === 'coming_soon'}
                >
                  {(ssoLoading || (erpNextLoading && app.slug === 'erpnext-business-suite')) ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  {(ssoLoading || (erpNextLoading && app.slug === 'erpnext-business-suite')) ? 'Opening...' : 'Open'}
                </Button>
              ) : (
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-6 hover:shadow-md transition-all duration-200 group cursor-pointer relative">
        {app.isFeatured && (
          <div className="absolute top-2 right-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${app.color || 'bg-blue-500'} text-white`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {app.hasAccess ? (
                <DropdownMenuItem onClick={handleOpenApp}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open App
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/pricing">
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Upgrade to Access
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                App Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-foreground">{app.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {app.shortDescription || app.description}
          </p>
          
          {/* App Features */}
          {app.features && app.features.length > 0 && (
            <div className="mb-3">
              <ul className="text-xs text-muted-foreground space-y-1">
                {app.features.slice(0, 2).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {app.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            {getAccessBadge(app)}
            {getIntegrationStatusBadge(app.integrationStatus)}
          </div>
          
          {app.hasAccess ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOpenApp}
              disabled={ssoLoading || erpNextLoading || app.status !== 'active' || app.integrationStatus === 'coming_soon'}
            >
              {(ssoLoading || (erpNextLoading && app.slug === 'erpnext-business-suite')) ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              {(ssoLoading || (erpNextLoading && app.slug === 'erpnext-business-suite')) ? 'Opening...' : 'Open'}
            </Button>
          ) : (
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                <Lock className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      </Card>
    );
  };

  // Calculate categories with counts
  const categories = [
    { id: 'all', name: 'All Apps', count: apps.length },
    { id: 'accessible', name: 'Available', count: apps.filter(app => app.hasAccess).length },
    { id: 'premium', name: 'Premium', count: apps.filter(app => app.requiresPlan).length },
    { id: 'featured', name: 'Featured', count: apps.filter(app => app.isFeatured).length },
    { id: 'popular', name: 'Popular', count: apps.filter(app => app.isPopular).length },
  ];

  return (
    <div className="space-y-6">
      {/* Error Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            SSO Error: {error}
          </AlertDescription>
        </Alert>
      )}
      
      {erpNextError && !showPasswordDialog && (
        <Alert variant="destructive">
          <AlertDescription>
            ERPNext Error: {erpNextError}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Subscription Status */}
      {userSubscription && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Current Plan: {userSubscription.plan.name}</h4>
              <p className="text-sm text-blue-700">
                You have access to {apps.filter(app => app.hasAccess).length} of {apps.length} apps
              </p>
            </div>
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Apps Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {filteredApps.map((app) => (
          <AppCard key={app._id} app={app} />
        ))}
      </div>

      {/* Empty State */}
      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No apps found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Try adjusting your filters or explore our app marketplace.'}
          </p>
          <Link href="/pricing">
            <Button>
              <Crown className="mr-2 h-4 w-4" />
              Browse Premium Apps
            </Button>
          </Link>
        </div>
      )}

      {/* ERPNext Password Dialog */}
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSubmit={handleCreateErpNextSite}
        isLoading={erpNextCreating}
        error={erpNextError}
      />
    </div>
  );
}