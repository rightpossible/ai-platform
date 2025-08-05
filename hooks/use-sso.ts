import { useState } from 'react';

interface SSOResponse {
  success: boolean;
  token?: string;
  expiresAt?: number;
  targetApp?: string;
  redirectUrl?: string;
  error?: string;
}

interface SSOState {
  isLoading: boolean;
  error: string | null;
  lastTokenData: SSOResponse | null;
}

export function useSSO() {
  const [state, setState] = useState<SSOState>({
    isLoading: false,
    error: null,
    lastTokenData: null
  });

  const generateTokenAndRedirect = async (targetApp: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/sso/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetApp })
      });

      const data: SSOResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate SSO token');
      }

      if (data.success && data.redirectUrl) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          lastTokenData: data 
        }));

        // Redirect to target app with SSO token
        window.open(data.redirectUrl, '_blank');
        return true;
      } else {
        throw new Error(data.error || 'Invalid response from SSO service');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return false;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    generateTokenAndRedirect,
    clearError
  };
}