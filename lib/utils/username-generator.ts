/**
 * Utility functions for generating unique usernames for ERPNext sites
 */

import { UserErpNextSite } from '@/lib/db/schemas/userErpNextSite';

export interface UsernameGenerationOptions {
  userId: string;
  maxAttempts?: number;
  baseLength?: number;
  randomLength?: number;
}

/**
 * Generate a unique username for ERPNext site
 * Format: user{userId_suffix}{random_chars}{timestamp_suffix}
 */
export async function generateUniqueUsername(options: UsernameGenerationOptions): Promise<string> {
  const {
    userId,
    maxAttempts = 10,
    baseLength = 8,
    randomLength = 6
  } = options;

  let attempts = 0;
  let username: string;

  do {
    attempts++;
    
    if (attempts > maxAttempts) {
      throw new Error(`Unable to generate unique username after ${maxAttempts} attempts`);
    }

    // Create base from user ID (last 8 characters)
    const userIdSuffix = userId.toString().slice(-baseLength);
    const baseUsername = `user${userIdSuffix}`;
    
    // Add random characters for uniqueness
    const randomSuffix = Math.random()
      .toString(36)
      .substr(2, randomLength);
    
    // Add timestamp for additional uniqueness
    const timestampSuffix = Date.now().toString().slice(-4);
    
    // Combine all parts and ensure lowercase
    username = `${baseUsername}${randomSuffix}${timestampSuffix}`.toLowerCase();
    
    // Validate username format (should match schema validation)
    if (!isValidUsername(username)) {
      continue; // Try again if format is invalid
    }
    
    // Check database for uniqueness
    const existingUser = await UserErpNextSite.findOne({ username });
    if (!existingUser) {
      return username; // Found unique username
    }
    
  } while (attempts < maxAttempts);

  throw new Error(`Unable to generate unique username after ${maxAttempts} attempts`);
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  // Must be at least 6 characters, only lowercase letters and numbers
  return /^[a-z0-9]+$/.test(username) && username.length >= 6 && username.length <= 50;
}

/**
 * Generate a site URL from username
 */
export function generateSiteUrl(username: string): string {
  return `http://${username}.localhost:8000`;
}

/**
 * Extract username from site URL
 */
export function extractUsernameFromUrl(siteUrl: string): string | null {
  const match = siteUrl.match(/^https?:\/\/([^.]+)\.localhost:8000/);
  return match ? match[1] : null;
}
