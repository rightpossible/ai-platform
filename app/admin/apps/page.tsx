'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface AppData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  status: string;
  color?: string;
  category?: string;
  tags?: string[];
  features?: string[];
  screenshots?: string[];
  rating?: number;
  popularity?: number;
  integrationStatus?: string;
  requiresPlan: boolean;
  minimumPlanLevel?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export default function AppsPage() {
  const searchParams = useSearchParams();
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  useEffect(() => {
    fetchApps();
    
    // Check if redirected from delete page
    if (searchParams.get('deleted') === 'true') {
      setSeedMessage('✅ App deleted successfully!');
      // Clear message after 3 seconds
      setTimeout(() => setSeedMessage(''), 3000);
    }
  }, [searchParams]);

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

  const handleSeedErpNext = async () => {
    setSeeding(true);
    setSeedMessage('');
    
    try {
      const response = await fetch('/api/admin/seed-erpnext', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSeedMessage(data.isNewApp ? '✅ ERPNext app seeded successfully!' : '✅ ERPNext app already exists');
        // Refresh the apps list
        await fetchApps();
      } else {
        setSeedMessage('❌ Failed to seed ERPNext app');
      }
    } catch (error) {
      console.error('Error seeding ERPNext:', error);
      setSeedMessage('❌ Error seeding ERPNext app');
    }
    
    setSeeding(false);
    // Clear message after 3 seconds
    setTimeout(() => setSeedMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Apps</h2>
          <p className="text-gray-600">Add and manage applications for SSO</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSeedErpNext}
            disabled={seeding}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {seeding ? 'Seeding...' : 'Seed ERPNext App'}
          </button>
          <Link 
            href="/admin/plans/apps" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Manage Plan Apps
          </Link>
          <Link 
            href="/admin/apps/add" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New App
          </Link>
        </div>
      </div>

      {/* Seed Message */}
      {seedMessage && (
        <div className={`p-4 rounded-lg ${
          seedMessage.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {seedMessage}
        </div>
      )}

      {/* Apps Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {apps.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No apps configured yet</p>
            <Link 
              href="/admin/apps/add" 
              className="text-blue-600 hover:text-blue-700"
            >
              Add your first app →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Features</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr> 
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apps.map((app) => (
                  <tr key={app._id.toString()}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg ${app.color || 'bg-blue-500'} flex items-center justify-center text-white text-sm font-medium mr-3 relative`}>
                          {app.name.charAt(0)}
                          {app.isFeatured && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">{app.name}</div>
                            {app.isPopular && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">Popular</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{app.shortDescription || app.description}</div>
                          {app.tags && app.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {app.tags.slice(0, 2).map((tag: string, index: number) => (
                                <span key={index} className="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col space-y-1">
                        <span className="capitalize text-sm font-medium">{app.category || 'business'}</span>
                        <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                          app.integrationStatus === 'ready' 
                            ? 'bg-green-100 text-green-700'
                            : app.integrationStatus === 'beta'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {app.integrationStatus || 'ready'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                          app.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {app.status}
                        </span>
                        {app.popularity && app.popularity > 0 && (
                          <span className="text-xs text-gray-500">{app.popularity}% popular</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                          app.requiresPlan 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {app.requiresPlan ? `Level ${app.minimumPlanLevel || 1}+` : 'Free'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {app.features && app.features.length > 0 && (
                          <span className="text-xs text-gray-600">{app.features.length} features</span>
                        )}
                        {app.screenshots && app.screenshots.length > 0 && (
                          <span className="text-xs text-gray-600">{app.screenshots.length} screenshots</span>
                        )}
                        {app.rating && app.rating > 0 && (
                          <span className="text-xs text-gray-600">⭐ {app.rating.toFixed(1)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/admin/apps/edit/${app._id}`} 
                        className="text-blue-600 hover:text-blue-700 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${app.name}"? This action cannot be undone.`)) {
                            window.location.href = `/admin/apps/delete/${app._id}`;
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}