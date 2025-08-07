'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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
  AlertTriangle
} from 'lucide-react';

interface ErpNextSite {
  siteUrl: string;
  status: 'creating' | 'active' | 'suspended';
  username: string;
  adminPassword?: string;
}

export function ErpNextCredentialsWidget() {
  const [site, setSite] = useState<ErpNextSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteInfo();
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
          text: 'Active'
        };
      case 'creating':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          text: 'Creating'
        };

      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertTriangle,
          text: status
        };
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">ERPNext Business Suite</h3>
            <p className="text-sm text-gray-600">Loading credentials...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!site) {
    return null; // Don't show widget if user doesn't have ERPNext site
  }

  const statusInfo = getStatusInfo(site.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="p-6 border-l-4 border-l-blue-600">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">ERPNext Business Suite</h3>
            <p className="text-sm text-gray-600">Your personal business platform</p>
          </div>
        </div>
        <Badge className={`${statusInfo.color} border`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusInfo.text}
        </Badge>
      </div>

      {site.status === 'active' && (
        <div className="space-y-4">
          {/* Site URL */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <Globe className="w-4 h-4 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Site URL</p>
                <p className="text-sm text-gray-600 font-mono">{site.siteUrl}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(site.siteUrl, 'url')}
                className="h-8 px-3"
              >
                {copied === 'url' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
              <Button
                size="sm"
                onClick={() => window.open(site.siteUrl, '_blank')}
                className="h-8 px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open
              </Button>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Username</p>
                <p className="text-sm text-gray-600 font-mono">{site.username}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(site.username, 'username')}
              className="h-8 px-3"
            >
              {copied === 'username' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <Key className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Password</p>
                <p className="text-sm text-gray-600 font-mono">
                  {userPassword ? (showPassword ? userPassword : '••••••••••••') : 'Not available'}
                </p>
                {userPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ Keep this secure - password cannot be recovered if lost
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
                    className="h-8 px-3"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(userPassword, 'password')}
                    className="h-8 px-3"
                  >
                    {copied === 'password' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Quick Access Features */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Quick Access</p>
              <Link href="/dashboard/erpnext-credentials">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-600">✓ CRM & Sales</div>
              <div className="text-gray-600">✓ HR Management</div>
              <div className="text-gray-600">✓ Accounting</div>
              <div className="text-gray-600">✓ Project Management</div>
            </div>
          </div>
        </div>
      )}

      {site.status === 'creating' && (
        <div className="text-center py-4">
          <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Your business platform is being created...</p>
          <p className="text-xs text-gray-500 mt-1">This usually takes 3-5 minutes</p>
        </div>
      )}


    </Card>
  );
}
