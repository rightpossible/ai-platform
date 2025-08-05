import { validateSSOToken, type SSOTokenPayload } from './token-generator';
import { connectDB } from '@/lib/db/connection';
import { SSOToken } from '@/lib/db/schemas/ssoToken';
import { createHash } from 'crypto';

/**
 * Validates SSO token and marks it as used
 * This function should be called by target applications
 */
export async function validateAndMarkTokenUsed(token: string): Promise<{
  valid: boolean;
  payload?: SSOTokenPayload;
  error?: string;
}> {
  try {
    // Validate token signature and expiration
    const payload = validateSSOToken(token);
    if (!payload) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    // Connect to database to check if token was already used
    await connectDB();
    
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const tokenRecord = await SSOToken.findOne({ tokenHash });

    if (!tokenRecord) {
      return { valid: false, error: 'Token not found in database' };
    }

    if (tokenRecord.usedAt) {
      return { valid: false, error: 'Token has already been used' };
    }

    if (tokenRecord.expiresAt < new Date()) {
      return { valid: false, error: 'Token has expired' };
    }

    // Mark token as used
    tokenRecord.usedAt = new Date();
    await tokenRecord.save();

    return { 
      valid: true, 
      payload 
    };

  } catch (error) {
    console.error('Token validation error:', error);
    return { 
      valid: false, 
      error: 'Internal validation error' 
    };
  }
}

/**
 * Helper function to get token info without marking as used
 */
export async function getTokenInfo(token: string): Promise<{
  valid: boolean;
  payload?: SSOTokenPayload;
  used?: boolean;
  error?: string;
}> {
  try {
    const payload = validateSSOToken(token);
    if (!payload) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    await connectDB();
    
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const tokenRecord = await SSOToken.findOne({ tokenHash });

    if (!tokenRecord) {
      return { valid: false, error: 'Token not found in database' };
    }

    return {
      valid: true,
      payload,
      used: !!tokenRecord.usedAt
    };

  } catch (error) {
    console.error('Token info error:', error);
    return { 
      valid: false, 
      error: 'Internal error' 
    };
  }
}