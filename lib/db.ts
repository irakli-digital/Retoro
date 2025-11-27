import { neon } from '@neondatabase/serverless';

// Fix for "self-signed certificate in certificate chain" error in local development
// This often happens when behind a corporate proxy or using certain antivirus software
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL);