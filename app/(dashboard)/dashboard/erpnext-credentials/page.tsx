'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useErpNext } from '@/hooks/use-erpnext';
import { PasswordDialog } from '@/components/erpnext/password-dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff,
  User,
  Key,
  Globe,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Settings,
  BarChart3,
  Users,
  CreditCard,
  Briefcase,
  MessageSquare,
  Package,
  Crown,
  ArrowUpCircle,
  Star,
  Zap,
  TrendingUp,
  FileText,
  Shield,
  Calendar,
  Plus
} from 'lucide-react';

interface ErpNextSite {
  siteUrl: string;
  status: 'creating' | 'active' | 'suspended';
  username: string;
  adminPassword?: string;
}

export default function ErpNextCredentialsPage() {
  const router = useRouter();
  const [site, setSite] = useState<ErpNextSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessInfo, setAccessInfo] = useState<any>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  
  const { 
    isCreating: erpNextCreating, 
    error: erpNextError, 
    createSite, 
    openSite, 
    clearError: clearErpNextError 
  } = useErpNext();

  useEffect(() => {
    fetchSiteInfo();
    checkUserAccess();
  }, []);



  const fetchSiteInfo = async () => {
    try {
      const response = await fetch('/api/erpnext/create-site');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.hasSite) {
          setSite(data.site);
          // Use password from API response (saved in database)
          if (data.site.adminPassword) {
            setUserPassword(data.site.adminPassword);
          } else {
            // Fallback to localStorage if not in API response
            const savedPassword = localStorage.getItem('erpnext_password');
            if (savedPassword) {
              setUserPassword(savedPassword);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching site info:', error);
    }
    setLoading(false);
  };

  const checkUserAccess = async () => {
    try {
      const response = await fetch('/api/apps/catalog');
      if (response.ok) {
        const data = await response.json();
        const erpNextApp = data.apps?.find((app: any) => app.slug === 'erpnext-business-suite');
        if (erpNextApp) {
          setHasAccess(erpNextApp.hasAccess);
          setAccessInfo({
            accessReason: erpNextApp.accessReason,
            requiredPlanLevel: erpNextApp.requiredPlanLevel,
            userPlanLevel: erpNextApp.userPlanLevel,
            userSubscription: data.userSubscription
          });
        }
      }
    } catch (error) {
      console.error('Error checking user access:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSiteInfo();
    await checkUserAccess();
    setRefreshing(false);
  };

  const handleCreateErpNextSite = async (password: string) => {
    const site = await createSite({ password });
    if (site) {
      setShowPasswordDialog(false);
      await fetchSiteInfo(); // Refresh site info
      if (site.status === 'active') {
        openSite(site.siteUrl);
      }
    }
  };

  const handleDeleteSite = async () => {
    if (!confirm('Are you sure you want to delete your ERPNext site? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-my-site', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Delete result:', data);
        await fetchSiteInfo(); // Refresh to show clean state
        alert('Site deleted successfully! You can now create a new one.');
      } else {
        alert('Failed to delete site. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting site:', error);
      alert('Error deleting site. Please try again.');
    }
  };



  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          text: 'Active',
          description: 'Your business platform is ready to use'
        };
      case 'creating':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          text: 'Creating',
          description: 'Setting up your business platform (3-5 minutes)'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle,
          text: 'Failed',
          description: 'Site creation encountered an error'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertTriangle,
          text: status,
          description: 'Unknown status'
        };
    }
  };

  const modules = [
    { name: 'CRM & Sales', icon: BarChart3, description: 'Lead management, opportunities, customers' },
    { name: 'Human Resources', icon: Users, description: 'Employee management, payroll, leave tracking' },
    { name: 'Accounting', icon: CreditCard, description: 'Invoicing, payments, financial reports' },
    { name: 'Project Management', icon: Briefcase, description: 'Tasks, timesheets, project tracking' },
    { name: 'Customer Support', icon: MessageSquare, description: 'Ticketing system, knowledge base' },
    { name: 'Inventory', icon: Package, description: 'Stock tracking, warehouses, purchase orders' }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Business Platform Credentials</h2>
            <p className="text-muted-foreground mt-1">Loading your ERPNext platform information...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Business Platform Credentials</h2>
            <p className="text-muted-foreground mt-1">Create your complete business management platform</p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* ERPNext Advertisement */}
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                All-in-One Business Pro
              </h3>
              <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                Transform your business with ERPNext - the world's most comprehensive business platform. 
                Everything you need to run and grow your business, all in one place.
              </p>
              
              {/* Action Button */}
              {hasAccess ? (
                <Button
                  onClick={() => setShowPasswordDialog(true)}
                  disabled={erpNextCreating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
                >
                  {erpNextCreating ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating Platform...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Create My Business Platform
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <Alert variant="warning" className="max-w-lg mx-auto">
                    <Crown className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pro Plan Required:</strong> Upgrade to access your complete business platform with all enterprise features.
                    </AlertDescription>
                  </Alert>
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg">
                      <ArrowUpCircle className="mr-2 h-5 w-5" />
                      Upgrade to Pro Plan
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[
              { 
                icon: TrendingUp, 
                title: 'CRM & Sales', 
                description: 'Lead management, opportunities, customer tracking, sales pipeline',
                color: 'bg-green-100 text-green-700'
              },
              { 
                icon: Users, 
                title: 'Human Resources', 
                description: 'Employee management, payroll, leave tracking, performance reviews',
                color: 'bg-blue-100 text-blue-700'
              },
              { 
                icon: CreditCard, 
                title: 'Accounting & Finance', 
                description: 'Invoicing, payments, financial reports, budgeting',
                color: 'bg-purple-100 text-purple-700'
              },
              { 
                icon: Briefcase, 
                title: 'Project Management', 
                description: 'Tasks, timesheets, project tracking, resource allocation',
                color: 'bg-orange-100 text-orange-700'
              },
              { 
                icon: Package, 
                title: 'Inventory Management', 
                description: 'Stock tracking, warehouses, purchase orders, suppliers',
                color: 'bg-cyan-100 text-cyan-700'
              },
              { 
                icon: MessageSquare, 
                title: 'Customer Support', 
                description: 'Ticketing system, knowledge base, customer communications',
                color: 'bg-pink-100 text-pink-700'
              },
              { 
                icon: BarChart3, 
                title: 'Analytics & Reports', 
                description: 'Business intelligence, custom dashboards, data insights',
                color: 'bg-indigo-100 text-indigo-700'
              },
              { 
                icon: FileText, 
                title: 'Document Management', 
                description: 'File storage, document workflows, collaboration tools',
                color: 'bg-teal-100 text-teal-700'
              },
              { 
                icon: Shield, 
                title: 'Security & Compliance', 
                description: 'Role-based permissions, audit trails, data security',
                color: 'bg-red-100 text-red-700'
              }
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <FeatureIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Benefits Section */}
          <Card className="p-8 mt-8 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose ERPNext?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Lightning Fast Setup</h5>
                <p className="text-gray-600 text-sm">Your complete business platform ready in 3-5 minutes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Enterprise Grade</h5>
                <p className="text-gray-600 text-sm">Trusted by thousands of businesses worldwide</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">All-in-One Solution</h5>
                <p className="text-gray-600 text-sm">No need for multiple tools - everything integrated</p>
              </div>
            </div>
          </Card>

          {/* Current Plan Info */}
          {accessInfo?.userSubscription && (
            <Alert className="mt-6">
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Plan:</strong> {accessInfo.userSubscription.plan?.name || 'Free'} 
                {!hasAccess && accessInfo.requiredPlanLevel && (
                  <span className="text-orange-600 ml-2">
                    (Pro Plan required for Business Platform access)
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {erpNextError && (
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {erpNextError}
              </AlertDescription>
            </Alert>
          )}
        </div>



        {/* Password Dialog */}
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

  const statusInfo = getStatusInfo(site.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Business Platform Credentials</h2>
          <p className="text-muted-foreground mt-1">Access your ERPNext business management platform</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {/* Temporary delete button for testing */}
          <Button 
            onClick={handleDeleteSite}
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Delete Site (Testing)
          </Button>
        </div>
      </div>

      {/* Main Credentials Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">ERPNext Business Suite</h3>
              <p className="text-gray-600">Your complete business management platform</p>
            </div>
          </div>
          <Badge className={`${statusInfo.color} border`}>
            <StatusIcon className="w-4 h-4 mr-2" />
            {statusInfo.text}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-6">{statusInfo.description}</p>

        {site.status === 'active' && (
          <div className="space-y-6">
            {/* Access Credentials */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Access Credentials</h4>
              <div className="grid gap-4">
                {/* Site URL */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Site URL</p>
                      <p className="text-gray-600 font-mono text-sm break-all">{site.siteUrl}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(site.siteUrl, 'url')}
                    >
                      {copied === 'url' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(site.siteUrl, '_blank')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Platform
                    </Button>
                  </div>
                </div>

                {/* Username */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Username</p>
                      <p className="text-gray-600 font-mono">{site.username}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(site.username, 'username')}
                  >
                    {copied === 'username' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <Key className="w-5 h-5 text-gray-500" />
                                          <div>
                        <p className="font-medium text-gray-700">Password</p>
                        <p className="text-gray-600 font-mono">
                          {userPassword ? (showPassword ? userPassword : '••••••••••••') : 'Not available'}
                        </p>
                        {userPassword && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Store this securely - password cannot be recovered if lost
                          </p>
                        )}
                      </div>
                  </div>
                  <div className="flex space-x-2">
                    {userPassword && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(userPassword, 'password')}
                        >
                          {copied === 'password' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Available Modules */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Business Modules</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module, index) => {
                  const ModuleIcon = module.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <ModuleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{module.name}</p>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {site.status === 'creating' && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Platform Creation in Progress</h4>
            <p className="text-gray-600 mb-4">Your business platform is being set up with all modules...</p>
            <p className="text-sm text-gray-500">This usually takes 3-5 minutes. You'll receive an email when it's ready.</p>
          </div>
        )}


      </Card>

      {/* Security Notice */}
      {site.status === 'active' && (
        <div className="space-y-3">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important Security Information:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Your password is securely stored and displayed here for your convenience</li>
                <li>• <strong>We cannot recover your password if you lose access</strong> - please store it safely</li>
                <li>• You can change your password anytime through the ERPNext platform settings</li>
                <li>• Consider using a password manager for additional security</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Platform Access:</strong> Use these credentials to log into your ERPNext business platform. 
              Your platform includes all business modules and is fully configured for immediate use.
            </AlertDescription>
          </Alert>
        </div>
      )}


    </div>
  );
}
