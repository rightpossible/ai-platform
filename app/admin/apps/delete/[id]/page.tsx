'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
}

export default function DeleteAppPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApp();
  }, []);

  const fetchApp = async () => {
    try {
      const response = await fetch(`/api/admin/apps/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setApp(data.app);
      } else {
        setError('App not found');
      }
    } catch (error) {
      console.error('Error fetching app:', error);
      setError('Failed to load app');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!app) return;
    
    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/apps/${params.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Redirect back to apps page with success message
        router.push('/admin/apps?deleted=true');
      } else {
        setError(data.error || 'Failed to delete app');
      }
    } catch (error) {
      console.error('Error deleting app:', error);
      setError('Failed to delete app');
    }
    
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error && !app) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Delete App</h2>
            <p className="text-gray-600">App not found or error occurred</p>
          </div>
          <Link
            href="/admin/apps"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Apps
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delete App</h2>
          <p className="text-gray-600">Permanently remove this application</p>
        </div>
        <Link
          href="/admin/apps"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back to Apps
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* App Info Card */}
      {app && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 rounded-lg ${app.color || 'bg-blue-500'} flex items-center justify-center text-white text-lg font-medium mr-4`}>
              {app.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
              <p className="text-gray-600">{app.shortDescription || app.description}</p>
              <p className="text-sm text-gray-500 mt-1">Slug: {app.slug}</p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Danger Zone
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    This action cannot be undone. This will permanently delete the app and:
                  </p>
                  <ul className="list-disc ml-5 mt-2">
                    <li>Remove it from all subscription plans</li>
                    <li>Delete all associated SSO configurations</li>
                    <li>Users will lose access to this app immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link
              href="/admin/apps"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete App'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
