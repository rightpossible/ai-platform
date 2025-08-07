/**
 * ERPNext SaaS API utilities
 * Helper functions for interacting with the ERPNext backend API
 */

const ERPNEXT_API_BASE = 'http://localhost:8080';

export interface ErpNextSiteData {
  site_url: string;
  username: string;
  password: string;
  email: string;
}

export interface ErpNextApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export interface SiteCheckResult {
  site_name: string;
  username: string;
  exists: boolean;
  site_url: string | null;
}

/**
 * Create a customer site on ERPNext backend
 */
export async function createCustomerSite(
  username: string, 
  email: string, 
  password: string,
  timeoutMs: number = 300000
): Promise<ErpNextApiResponse> {
  try {
    const response = await fetch(`${ERPNEXT_API_BASE}/create-customer-site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    console.error('ERPNext createCustomerSite error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if a site exists on ERPNext backend
 */
export async function checkSiteExists(
  username: string,
  timeoutMs: number = 10000
): Promise<{ success: boolean; exists: boolean; data?: SiteCheckResult }> {
  try {
    const response = await fetch(`${ERPNEXT_API_BASE}/check-site/${username}`, {
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!response.ok) {
      return {
        success: false,
        exists: false
      };
    }

    const result = await response.json();
    
    return {
      success: result.success,
      exists: result.data?.exists || false,
      data: result.data
    };
  } catch (error) {
    console.error('ERPNext checkSiteExists error:', error);
    return {
      success: false,
      exists: false
    };
  }
}

/**
 * Delete a customer site from ERPNext backend
 */
export async function deleteCustomerSite(
  username: string,
  timeoutMs: number = 30000
): Promise<ErpNextApiResponse> {
  try {
    const response = await fetch(`${ERPNEXT_API_BASE}/delete-customer-site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    console.error('ERPNext deleteCustomerSite error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * List all sites on ERPNext backend
 */
export async function listAllSites(
  timeoutMs: number = 10000
): Promise<ErpNextApiResponse> {
  try {
    const response = await fetch(`${ERPNEXT_API_BASE}/list-sites`, {
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    console.error('ERPNext listAllSites error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check ERPNext API status
 */
export async function getApiStatus(
  timeoutMs: number = 5000
): Promise<ErpNextApiResponse> {
  try {
    const response = await fetch(`${ERPNEXT_API_BASE}/api-status`, {
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    console.error('ERPNext getApiStatus error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
