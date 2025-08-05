'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SSOTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSSO = async (appId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/sso/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetApp: appId })
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Show the generated URL instead of redirecting
        console.log('Generated SSO URL:', data.redirectUrl);
      }
    } catch (error) {
      setResult({ error: 'Network error' });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SSO Test Page</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['crm', 'finance', 'hr', 'email'].map(app => (
          <Button 
            key={app}
            onClick={() => testSSO(app)}
            disabled={loading}
            className="h-20"
          >
            Test {app.toUpperCase()}
          </Button>
        ))}
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>SSO Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    ✅ SSO Token Generated Successfully!
                  </AlertDescription>
                </Alert>
                
                <div>
                  <strong>Target App:</strong> {result.targetApp}
                </div>
                <div>
                  <strong>Token (first 50 chars):</strong> 
                  <code className="block text-xs mt-1 p-2 bg-gray-100 rounded">
                    {result.token?.substring(0, 50)}...
                  </code>
                </div>
                <div>
                  <strong>Redirect URL:</strong>
                  <code className="block text-xs mt-1 p-2 bg-gray-100 rounded break-all">
                    {result.redirectUrl}
                  </code>
                </div>
                <div>
                  <strong>Expires At:</strong> {new Date(result.expiresAt).toLocaleString()}
                </div>
                
                <Button 
                  onClick={() => window.open(result.redirectUrl, '_blank')}
                  className="mt-4"
                >
                  🚀 Test Redirect (Opens in New Tab)
                </Button>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>
                  ❌ Error: {result.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">How to test:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click any app button above</li>
          <li>Check the generated token and URL</li>
          <li>Click "Test Redirect" to see it in action</li>
          <li>The test URLs go to httpbin.org which shows the token data</li>
        </ol>
      </div>
    </div>
  );
}