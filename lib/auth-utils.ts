import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a secure token for magic links
 */
export function generateMagicLinkToken(): string {
  return nanoid(32);
}

/**
 * Generate email verification token
 */
export function generateVerificationToken(): string {
  return nanoid(32);
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
  return nanoid(64); // Longer token for sessions (64 chars)
}

/**
 * Calculate session expiration date (30 days from now)
 */
export function getSessionExpiration(): Date {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 30); // 30 days
  return expiration;
}

