import { useState } from 'react';

interface ErpNextSite {
  siteUrl: string;
  status: 'creating' | 'active' | 'failed' | 'suspended';
  username: string;
  adminPassword?: string;
}

interface ErpNextState {
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  site: ErpNextSite | null;
}

interface CreateSiteParams {
  password: string;
}

export function useErpNext() {
  const [state, setState] = useState<ErpNextState>({
    isLoading: false,
    isCreating: false,
    error: null,
    site: null
  });

  const checkExistingSite = async (): Promise<ErpNextSite | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/erpnext/create-site', {
        method: 'GET'
      });

      const data = await response.json();

      if (data.success && data.hasSite) {
        const site = data.site;
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          site 
        }));
        return site;
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          site: null 
        }));
        return null;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check existing site';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  const createSite = async ({ password }: CreateSiteParams): Promise<ErpNextSite | null> => {
    setState(prev => ({ ...prev, isCreating: true, error: null }));

    try {
      const response = await fetch('/api/erpnext/create-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        const site = data.site;
        setState(prev => ({ 
          ...prev, 
          isCreating: false,
          site 
        }));
        return site;
      } else {
        throw new Error(data.error || 'Failed to create ERPNext site');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ 
        ...prev, 
        isCreating: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  const openSite = (siteUrl: string) => {
    window.open(siteUrl, '_blank');
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    checkExistingSite,
    createSite,
    openSite,
    clearError
  };
}
