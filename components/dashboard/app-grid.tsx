import { useState, useEffect } from 'react';
import { useSSO } from '@/hooks/use-sso';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface App {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
  color?: string;
  icon?: string;
}

interface AppGridProps {
  viewMode: 'grid' | 'list';
}

export function AppGrid({ viewMode }: AppGridProps) {
  const [filter, setFilter] = useState('all');
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoading: ssoLoading, error, generateTokenAndRedirect, clearError } = useSSO();

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/admin/apps');
      if (response.ok) {
        const data = await response.json();
        setApps(data.apps || []);
      }
    } catch (error) {
      console.error('Error fetching apps:', error);
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

  // Convert database apps to display format
  const displayApps = apps.map(app => ({
    id: app.slug,
    name: app.name,
    description: app.description || '',
    icon: app.icon || 'Building2', // Default icon
    color: app.color || 'bg-blue-500',
    status: app.status,
    category: 'business', // Default category
    aiAgent: false // Default value
  }));

  const filteredApps = displayApps.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'active') return app.status === 'active';
    return true; // Simplified filtering
  });

  const categories = [
    { id: 'all', name: 'All Apps', count: displayApps.length },
    { id: 'active', name: 'Active', count: displayApps.filter(app => app.status === 'active').length }
  ];

  const AppCard = ({ app }: { app: typeof displayApps[0] }) => {
    const IconComponent = Building2; // Default icon
    
    const handleOpenApp = async () => {
      if (app.status !== 'active') {
        // Show notification that app is not active
        alert('This app is not active. Please contact support to activate it.');
        return;
      }
      
      clearError();
      await generateTokenAndRedirect(app.id);
    };
    
    if (viewMode === 'list') {
      return (
        <Card className="p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className={`p-3 rounded-lg ${app.color} text-white`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">{app.name}</h3>
                    {app.aiAgent && (
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                        AI
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{app.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenApp}
                  disabled={ssoLoading || app.status !== 'active'}
                >
                  {ssoLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  {ssoLoading ? 'Opening...' : 'Open'}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {app.status === 'active' ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
        </Card>
      );
    }

    return (
      <Card className="p-6 hover:shadow-md transition-all duration-200 group cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${app.color} text-white`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleOpenApp}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open App
                  </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {app.status === 'active' ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-foreground">{app.name}</h3>
            {app.aiAgent && (
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                AI
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{app.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs rounded-full ${
            app.status === 'active' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
          }`}>
            {app.status}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleOpenApp}
            disabled={ssoLoading || app.status !== 'active'}
          >
            {ssoLoading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <ExternalLink className="mr-2 h-4 w-4" />
            )}
            {ssoLoading ? 'Opening...' : 'Open'}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            SSO Error: {error}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={filter === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(category.id)}
            className="rounded-full"
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Apps Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {filteredApps.map((app) => (
          <AppCard key={app.id} app={app} />
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
            Try adjusting your filters or explore our app marketplace.
          </p>
          <Button>
            Browse Apps
          </Button>
        </div>
      )}
    </div>
  );
}