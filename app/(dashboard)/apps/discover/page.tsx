'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Grid3X3,
  List,
  Crown,
  Star,
  TrendingUp,
  CheckCircle,
  Filter,
  SortAsc,
  Building2,
  ExternalLink,
  ArrowUpCircle,
  Clock,
  Lock,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface CatalogApp {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
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
  website?: string;
  supportUrl?: string;
}

interface UserSubscription {
  plan: {
    name: string;
    position: number;
  };
  status: string;
}

export default function AppDiscoveryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [apps, setApps] = useState<CatalogApp[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Get unique categories
  const categories = ['all', ...new Set(apps.map(app => app.category).filter(Boolean))];

  // Filter and sort apps
  const filteredAndSortedApps = apps
    .filter(app => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          app.name.toLowerCase().includes(query) ||
          app.description?.toLowerCase().includes(query) ||
          app.longDescription?.toLowerCase().includes(query) ||
          app.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          app.category?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && app.category !== categoryFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'access':
          if (a.hasAccess && !b.hasAccess) return -1;
          if (!a.hasAccess && b.hasAccess) return 1;
          return 0;
        default:
          return 0;
      }
    });

  const getAccessBadge = (app: CatalogApp) => {
    if (app.hasAccess) {
      if (app.accessReason === 'free') {
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">Free</Badge>;
      }
      return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Included</Badge>;
    }
    
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
      <Crown className="w-3 h-3 mr-1" />
      Premium
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
    const IconComponent = Building2;
    
    if (viewMode === 'list') {
      return (
        <Card className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className={`p-3 rounded-lg ${app.color || 'bg-blue-500'} text-white relative flex-shrink-0`}>
                <IconComponent className="h-8 w-8" />
                {app.isFeatured && (
                  <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 fill-current" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{app.name}</h3>
                  {getAccessBadge(app)}
                  {getIntegrationStatusBadge(app.integrationStatus)}
                  {app.isPopular && <Badge variant="secondary" className="bg-purple-50 text-purple-700">Popular</Badge>}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {app.longDescription || app.description || app.shortDescription}
                </p>
                
                {/* Features */}
                {app.features && app.features.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-foreground mb-2">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {app.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Tags */}
                {app.tags && app.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {app.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Rating and Popularity */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {app.rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {app.rating.toFixed(1)}
                    </div>
                  )}
                  {app.popularity && (
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {app.popularity}% popular
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2 ml-4">
              {app.hasAccess ? (
                <Button size="sm" asChild>
                  <a href={`/sso/${app.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open App
                  </a>
                </Button>
              ) : (
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Upgrade to Access
                  </Button>
                </Link>
              )}
              
              {/* External Links */}
              <div className="flex space-x-2">
                {app.website && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={app.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {app.supportUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={app.supportUrl} target="_blank" rel="noopener noreferrer">
                      Support
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      );
    }

    // Grid view (simplified version of the list view)
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
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-2">{app.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {app.shortDescription || app.description}
          </p>
          
          {/* Features */}
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
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            {getAccessBadge(app)}
            {getIntegrationStatusBadge(app.integrationStatus)}
          </div>
          
          {app.hasAccess ? (
            <Button variant="outline" size="sm" asChild>
              <a href={`/sso/${app.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </a>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          App Marketplace
        </h2>
        <p className="text-muted-foreground mt-1">
          Discover and access all available business applications
        </p>
      </div>

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

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-1 items-center space-x-4">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search apps, features, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
          
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setCategoryFilter(category || 'all')}
                >
                  {category === 'all' ? 'All Categories' : category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('popularity')}>
                Most Popular
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rating')}>
                Highest Rated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('access')}>
                Available First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center space-x-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-l-full rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-r-full rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Apps Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-6'
      }>
        {filteredAndSortedApps.map((app) => (
          <AppCard key={app._id} app={app} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedApps.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No apps found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}>
              Clear Filters
            </Button>
            <Link href="/pricing">
              <Button>
                <Crown className="mr-2 h-4 w-4" />
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}