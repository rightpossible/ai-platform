'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  X, 
  Star, 
  Crown,
  Globe,
  HelpCircle,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface AppFormData {
  // Basic fields
  name: string;
  slug: string; 
  ssoUrl: string;
  description: string;
  status: 'active' | 'inactive';
  color: string;
  
  // Plan-related fields
  requiresPlan: boolean;
  minimumPlanLevel: number;
  category: string;
  
  // Enhanced catalog fields
  shortDescription: string;
  longDescription: string;
  screenshots: string[];
  features: string[];
  tags: string[];
  website: string;
  supportUrl: string;
  integrationStatus: 'ready' | 'beta' | 'coming_soon';
  popularity: number;
  rating: number;
  isPopular: boolean;
  isFeatured: boolean;
  launchInNewTab: boolean;
}

export default function EditAppPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<AppFormData>({
    name: '',
    slug: '',
    ssoUrl: '',
    description: '',
    status: 'active',
    color: 'bg-blue-500',
    requiresPlan: false,
    minimumPlanLevel: 0,
    category: 'business',
    shortDescription: '',
    longDescription: '',
    screenshots: [],
    features: [],
    tags: [],
    website: '',
    supportUrl: '',
    integrationStatus: 'ready',
    popularity: 0,
    rating: 0,
    isPopular: false,
    isFeatured: false,
    launchInNewTab: false
  });

  // Fetch existing app data
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const response = await fetch(`/api/admin/apps/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.app) {
            const app = data.app;
            setFormData({
              name: app.name || '',
              slug: app.slug || '',
              ssoUrl: app.ssoUrl || '',
              description: app.description || '',
              status: app.status || 'active',
              color: app.color || 'bg-blue-500',
              requiresPlan: app.requiresPlan || false,
              minimumPlanLevel: app.minimumPlanLevel || 0,
              category: app.category || 'business',
              shortDescription: app.shortDescription || '',
              longDescription: app.longDescription || '',
              screenshots: app.screenshots || [],
              features: app.features || [],
              tags: app.tags || [],
              website: app.website || '',
              supportUrl: app.supportUrl || '',
              integrationStatus: app.integrationStatus || 'ready',
              popularity: app.popularity || 0,
              rating: app.rating || 0,
              isPopular: app.isPopular || false,
              isFeatured: app.isFeatured || false,
              launchInNewTab: app.launchInNewTab || false
            });
          }
        } else {
          alert('Error fetching app data');
          router.push('/admin/apps');
        }
      } catch (error) {
        console.error('Error fetching app:', error);
        alert('Error fetching app data');
        router.push('/admin/apps');
      }
      setFetchLoading(false);
    };

    fetchAppData();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/apps/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin/apps');
      } else {
        const error = await response.json();
        alert(`Error updating app: ${error.message || error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error updating app');
    }
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const addArrayItem = (field: 'screenshots' | 'features' | 'tags', value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()]
      });
    }
  };

  const removeArrayItem = (field: 'screenshots' | 'features' | 'tags', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-red-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-teal-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-gray-500', 'bg-emerald-500'
  ];

  const categories = [
    'business', 'productivity', 'communication', 'analytics', 'finance',
    'marketing', 'sales', 'support', 'development', 'design', 'ai', 'other'
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: CheckCircle },
    { id: 'catalog', label: 'Catalog Details', icon: Star },
    { id: 'access', label: 'Access Control', icon: Crown },
    { id: 'advanced', label: 'Advanced', icon: AlertCircle }
  ];

  const ArrayInputField = ({ 
    label, 
    field, 
    placeholder, 
    items 
  }: { 
    label: string; 
    field: 'screenshots' | 'features' | 'tags'; 
    placeholder: string;
    items: string[];
  }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
      addArrayItem(field, inputValue);
      setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button type="button" onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => removeArrayItem(field, index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Edit App</h2>
        <p className="text-gray-600">Update application details and configuration</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === tab.id 
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., CRM System"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug * (auto-generated)
                  </label>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., crm-system"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used in URLs and API calls</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSO URL *
                </label>
                <Input
                  type="url"
                  required
                  value={formData.ssoUrl}
                  onChange={(e) => setFormData({ ...formData, ssoUrl: e.target.value })}
                  placeholder="https://your-app.com/auth/sso"
                />
                <p className="text-xs text-gray-500 mt-1">Where users will be redirected with SSO tokens</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Basic Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of the application"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg ${color} ${
                        formData.color === color ? 'ring-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Catalog Details Tab */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One-line description for cards (max 150 chars)"
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/150 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, longDescription: e.target.value })}
                  rows={6}
                  placeholder="Comprehensive description for the app discovery page"
                  maxLength={2000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.longDescription.length}/2000 characters</p>
              </div>

              <ArrayInputField
                label="Features"
                field="features"
                placeholder="Add a key feature"
                items={formData.features}
              />

              <ArrayInputField
                label="Tags"
                field="tags"
                placeholder="Add a tag"
                items={formData.tags}
              />

              <ArrayInputField
                label="Screenshots (URLs)"
                field="screenshots"
                placeholder="https://example.com/screenshot.png"
                items={formData.screenshots}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support URL
                  </label>
                  <Input
                    type="url"
                    value={formData.supportUrl}
                    onChange={(e) => setFormData({ ...formData, supportUrl: e.target.value })}
                    placeholder="https://support.example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Integration Status
                  </label>
                  <select
                    value={formData.integrationStatus}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, integrationStatus: e.target.value as 'ready' | 'beta' | 'coming_soon' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ready">Ready</option>
                    <option value="beta">Beta</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popularity (0-100)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.popularity}
                    onChange={(e) => setFormData({ ...formData, popularity: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (1-5)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Popular App</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured App</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.launchInNewTab}
                    onChange={(e) => setFormData({ ...formData, launchInNewTab: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Open in New Tab</span>
                </label>
              </div>
            </div>
          )}

          {/* Access Control Tab */}
          {activeTab === 'access' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Access Control Settings</h4>
                <p className="text-sm text-yellow-700">
                  Configure who can access this application based on subscription plans.
                </p>
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.requiresPlan}
                  onChange={(e) => setFormData({ ...formData, requiresPlan: e.target.checked })}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-gray-700">Requires Paid Plan</span>
              </label>

              {formData.requiresPlan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Plan Level Required
                  </label>
                  <select
                    value={formData.minimumPlanLevel}
                    onChange={(e) => setFormData({ ...formData, minimumPlanLevel: parseInt(e.target.value) })}
                    className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>Free (Level 0)</option>
                    <option value={1}>Starter (Level 1)</option>
                    <option value={2}>Professional (Level 2)</option>
                    <option value={3}>Enterprise (Level 3)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Users must have at least this plan level to access the app
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Advanced Settings</h4>
                <p className="text-sm text-blue-700">
                  These settings affect how the application integrates with our platform.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Launch Behavior</h5>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="launchBehavior"
                        checked={!formData.launchInNewTab}
                        onChange={() => setFormData({ ...formData, launchInNewTab: false })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Open in same window (iframe compatible)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="launchBehavior"
                        checked={formData.launchInNewTab}
                        onChange={() => setFormData({ ...formData, launchInNewTab: true })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Open in new tab (external application)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            
            <div className="flex gap-2">
              {activeTab !== 'basic' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1].id);
                    }
                  }}
                >
                  Previous
                </Button>
              )}
              
              {activeTab !== 'advanced' ? (
                <Button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1].id);
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update App'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
