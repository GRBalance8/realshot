// src/lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

interface RateLimitResponse {
  check: (limit: number, token: string) => Promise<void>;
}

export default function rateLimit(options?: RateLimitOptions): RateLimitResponse {
  const tokenCache = new LRUCache<string, number>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
    updateAgeOnGet: true,
    updateAgeOnHas: true,
  });

  return {
    check: (limit: number, token: string): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || 0;
        const currentUsage = tokenCount + 1;
        tokenCache.set(token, currentUsage);
        
        const isRateLimited = currentUsage >= limit;
        
        if (isRateLimited) {
          reject(new Error('Rate limit exceeded'));
        } else {
          resolve();
        }
      }),
  };
}
