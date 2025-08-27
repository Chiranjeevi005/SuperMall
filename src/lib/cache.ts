'use client';

// In-memory cache with TTL (Time To Live)
class MemoryCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  // Set data in cache with optional TTL
  set(key: string, data: any, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiry });
  }

  // Get data from cache if not expired
  get(key: string): any {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Delete specific key
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all expired entries
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all entries
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    this.clearExpired(); // Clean up expired entries first
    return this.cache.size;
  }
}

// Create singleton instance
const memoryCache = new MemoryCache();

// Cache wrapper for async functions
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cached = memoryCache.get(key);
  if (cached !== null) {
    return cached;
  }

  // If not in cache, execute function and cache result
  try {
    const result = await fn();
    memoryCache.set(key, result, ttl);
    return result;
  } catch (error) {
    throw error;
  }
}

// Cache wrapper for sync functions
export function withCacheSync<T>(
  key: string,
  fn: () => T,
  ttl?: number
): T {
  // Try to get from cache first
  const cached = memoryCache.get(key);
  if (cached !== null) {
    return cached;
  }

  // If not in cache, execute function and cache result
  try {
    const result = fn();
    memoryCache.set(key, result, ttl);
    return result;
  } catch (error) {
    throw error;
  }
}

// Invalidate cache entry
export function invalidateCache(key: string): boolean {
  return memoryCache.delete(key);
}

// Invalidate cache entries by pattern
export function invalidateCachePattern(pattern: string): number {
  let count = 0;
  const regex = new RegExp(pattern);
  
  for (const key of memoryCache['cache'].keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
      count++;
    }
  }
  
  return count;
}

// Clear all cache
export function clearAllCache(): void {
  memoryCache.clear();
}

// Get cache statistics
export function getCacheStats(): { size: number; keys: string[] } {
  const keys = Array.from(memoryCache['cache'].keys());
  return {
    size: keys.length,
    keys
  };
}

export default memoryCache;