'use client';

import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  version: string;
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  version?: string; // Cache version for invalidation
  maxSize?: number; // Maximum number of items
}

interface OfflineContent {
  id: string;
  title: string;
  content: string;
  category: string;
  lastUpdated: number;
}

class SmartCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;
  private defaultTTL: number;
  private version: string;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.version = options.version || '1.0.0';
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      version: this.version,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Check version compatibility
    if (item.version !== this.version) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    const items = Array.from(this.cache.values());
    
    return {
      totalItems: this.cache.size,
      expiredItems: items.filter(item => now - item.timestamp > item.ttl).length,
      memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length,
      oldestItem: Math.min(...items.map(item => item.timestamp)),
      newestItem: Math.max(...items.map(item => item.timestamp)),
    };
  }
}

// Global cache instance
const globalCache = new SmartCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 50,
  version: '1.0.0',
});

// Offline content storage
const offlineContent: OfflineContent[] = [
  {
    id: 'programming-basics',
    title: 'Programming Fundamentals',
    content: 'Programming is the process of creating instructions for computers to follow. It involves writing code in programming languages to solve problems and create software applications.',
    category: 'fundamentals',
    lastUpdated: Date.now(),
  },
  {
    id: 'language-history',
    title: 'Programming Language History',
    content: 'Programming languages have evolved from machine code in the 1940s to high-level languages today. Key milestones include FORTRAN (1957), C (1972), Java (1995), and modern languages like Rust and Go.',
    category: 'history',
    lastUpdated: Date.now(),
  },
  {
    id: 'paradigms-overview',
    title: 'Programming Paradigms',
    content: 'Programming paradigms are different approaches to programming. Main paradigms include imperative, object-oriented, functional, and declarative programming.',
    category: 'paradigms',
    lastUpdated: Date.now(),
  },
  {
    id: 'modern-languages',
    title: 'Modern Programming Languages',
    content: 'Today\'s popular languages include JavaScript for web development, Python for data science, Java for enterprise applications, and newer languages like Rust for systems programming.',
    category: 'modern',
    lastUpdated: Date.now(),
  },
];

export const useSmartCache = <T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cachedData = globalCache.get<T>(key);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    // If offline, try to get offline content
    if (isOffline) {
      const offlineItem = offlineContent.find(item => item.id === key);
      if (offlineItem) {
        setData(offlineItem.content as T);
        return;
      }
    }

    // Fetch new data
    setLoading(true);
    setError(null);

    try {
      const newData = await fetcher();
      globalCache.set(key, newData, options?.ttl);
      setData(newData);
    } catch (err) {
      setError(err as Error);
      
      // Try offline content as fallback
      const offlineItem = offlineContent.find(item => item.id === key);
      if (offlineItem) {
        setData(offlineItem.content as T);
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, isOffline, options?.ttl]);

  const invalidate = useCallback(() => {
    globalCache.delete(key);
  }, [key]);

  const refresh = useCallback(() => {
    invalidate();
    fetchData();
  }, [invalidate, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isOffline,
    invalidate,
    refresh,
    cacheStats: globalCache.getStats(),
  };
};

export const useOfflineContent = () => {
  const [content, setContent] = useState<OfflineContent[]>(offlineContent);

  const getContentById = useCallback((id: string) => {
    return content.find(item => item.id === id);
  }, [content]);

  const getContentByCategory = useCallback((category: string) => {
    return content.filter(item => item.category === category);
  }, [content]);

  const addContent = useCallback((newContent: Omit<OfflineContent, 'lastUpdated'>) => {
    const contentWithTimestamp = {
      ...newContent,
      lastUpdated: Date.now(),
    };
    
    setContent(prev => {
      const existingIndex = prev.findIndex(item => item.id === newContent.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = contentWithTimestamp;
        return updated;
      }
      return [...prev, contentWithTimestamp];
    });
  }, []);

  return {
    content,
    getContentById,
    getContentByCategory,
    addContent,
  };
};

// Cache management utilities
export const cacheManager = {
  clear: () => globalCache.clear(),
  getStats: () => globalCache.getStats(),
  set: <T>(key: string, data: T, ttl?: number) => globalCache.set(key, data, ttl),
  get: <T>(key: string) => globalCache.get<T>(key),
  has: (key: string) => globalCache.has(key),
  delete: (key: string) => globalCache.delete(key),
};

export default useSmartCache;