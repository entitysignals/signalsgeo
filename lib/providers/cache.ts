import crypto from 'crypto';

export interface CacheEntry {
  key: string;
  data: any;
  expires_at: string;
}

// Simple in-memory cache (in production, use Redis or similar)
const cache = new Map<string, CacheEntry>();

export function getCacheKey(
  provider: string,
  prompt: string,
  locale: string,
  brand: string
): string {
  const dateBucket = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const input = `${provider}|${prompt}|${locale}|${brand}|${dateBucket}`;
  return crypto.createHash('md5').update(input).digest('hex');
}

export function getFromCache(key: string): any | null {
  const entry = cache.get(key);
  
  if (!entry) return null;
  
  // Check if expired
  if (new Date(entry.expires_at) < new Date()) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

export function setInCache(key: string, data: any, ttlHours: number = 24): void {
  const expires_at = new Date();
  expires_at.setHours(expires_at.getHours() + ttlHours);
  
  cache.set(key, {
    key,
    data,
    expires_at: expires_at.toISOString(),
  });
}

export function clearCache(): void {
  cache.clear();
}

