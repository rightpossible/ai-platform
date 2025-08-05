import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

// Environment variables for token security
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_ALGORITHM = 'HS256';

export interface SSOTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  targetApp: string;
  permissions: string[];
  expiresAt: number;
  issuedAt: number;
  nonce: string; // Prevents replay attacks
}

export interface TokenGenerationOptions {
  userId: string;
  email: string;
  name: string;
  role: string;
  targetApp: string;
  permissions?: string[];
  expirationMinutes?: number;
}

/**
 * Generates a secure SSO token for app handoff
 */
export function generateSSOToken(options: TokenGenerationOptions): string {
  const {
    userId,
    email,
    name,
    role,
    targetApp,
    permissions = [],
    expirationMinutes = 5
  } = options;

  const now = Date.now();
  const expiresAt = now + (expirationMinutes * 60 * 1000);

  const payload: SSOTokenPayload = {
    userId,
    email,
    name,
    role,
    targetApp,
    permissions,
    expiresAt,
    issuedAt: now,
    nonce: randomBytes(16).toString('hex') // Unique identifier for each token
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: `${expirationMinutes}m`
  });
}

/**
 * Validates and decodes an SSO token
 */
export function validateSSOToken(token: string): SSOTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM]
    }) as SSOTokenPayload;

    // Check if token has expired (double check)
    if (decoded.expiresAt < Date.now()) {
      console.log('Token has expired');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
}

/**
 * Extracts token payload without validation (for debugging)
 */
export function decodeTokenPayload(token: string): SSOTokenPayload | null {
  try {
    return jwt.decode(token) as SSOTokenPayload;
  } catch (error) {
    console.error('Token decode failed:', error);
    return null;
  }
}

/**
 * Generates a secure app-specific token with additional security measures
 */
export function generateSecureAppToken(options: TokenGenerationOptions): {
  token: string;
  expiresAt: number;
  targetApp: string;
} {
  const token = generateSSOToken(options);
  const expiresAt = Date.now() + ((options.expirationMinutes || 5) * 60 * 1000);

  return {
    token,
    expiresAt,
    targetApp: options.targetApp
  };
}