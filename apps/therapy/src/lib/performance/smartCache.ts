export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
  accessCount: number;
  lastAccessed: number;
  size: number; // estimated size in bytes
  version: string;
}

export interface CacheConfig {
  maxSize: number; // maximum cache size in bytes
  maxEntries: number; // maximum number of entries
  defaultTTL: number; // default TTL in milliseconds
  cleanupInterval: number; // cleanup interval in milliseconds
  enableCompression: boolean;
  enableEncryption: boolean;
  enablePersistence: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  entries: number;
  hitRate: number;
  averageAccessTime: number;
}

export class SmartCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private stats: CacheStats;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private compressionWorker: Worker | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB
      maxEntries: 1000,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      enableCompression: true,
      enableEncryption: false,
      enablePersistence: true,
      ...config
    };

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      entries: 0,
      hitRate: 0,
      averageAccessTime: 0
    };

    this.initializeCache();
    this.startCleanupTimer();
  }

  // Initialize cache
  private async initializeCache(): Promise<void> {
    if (this.config.enablePersistence) {
      await this.loadFromStorage();
    }

    if (this.config.enableCompression) {
      this.initializeCompressionWorker();
    }
  }

  // Initialize compression worker
  private initializeCompressionWorker(): void {
    if (typeof Worker !== 'undefined') {
      try {
        this.compressionWorker = new Worker(
          new URL('./compressionWorker.ts', import.meta.url)
        );
      } catch (error) {
        console.warn('Compression worker not available:', error);
        this.config.enableCompression = false;
      }
    }
  }

  // Get value from cache
  async get(key: string): Promise<T | null> {
    const startTime = performance.now();
    
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      // Check if entry has expired
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      this.stats.hits++;
      this.updateHitRate();

      // Update average access time
      const accessTime = performance.now() - startTime;
      this.stats.averageAccessTime = 
        (this.stats.averageAccessTime * (this.stats.hits - 1) + accessTime) / this.stats.hits;

      // Decompress if needed
      if (this.config.enableCompression && entry.data instanceof Blob) {
        return await this.decompress(entry.data);
      }

      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
  }

  // Set value in cache
  async set(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const now = Date.now();
      const entryTTL = ttl || this.config.defaultTTL;
      
      // Calculate size
      const size = this.calculateSize(value);
      
      // Compress if needed
      let processedValue = value;
      if (this.config.enableCompression && size > 1024) { // Only compress if > 1KB
        processedValue = await this.compress(value) as T;
      }

      const entry: CacheEntry<T> = {
        data: processedValue,
        timestamp: now,
        ttl: entryTTL,
        accessCount: 0,
        lastAccessed: now,
        size: this.calculateSize(processedValue),
        version: '1.0'
      };

      // Check if we need to evict entries
      await this.evictIfNeeded(entry.size);

      // Store entry
      this.cache.set(key, entry);
      this.stats.entries = this.cache.size;
      this.stats.size += entry.size;

      // Persist to storage if enabled
      if (this.config.enablePersistence) {
        await this.persistToStorage();
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Delete value from cache
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.stats.size -= entry.size;
      this.stats.entries = this.cache.size;
      return this.cache.delete(key);
    }
    return false;
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.entries = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.evictions = 0;
    this.updateHitRate();
  }

  // Check if key exists
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Get cache size
  getSize(): number {
    return this.stats.size;
  }

  // Get number of entries
  getEntryCount(): number {
    return this.stats.entries;
  }

  // Check if entry is expired
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  // Calculate size of value
  private calculateSize(value: any): number {
    try {
      const jsonString = JSON.stringify(value);
      return new Blob([jsonString]).size;
    } catch (error) {
      // Fallback for non-serializable values
      return 1024; // Default 1KB
    }
  }

  // Update hit rate
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  // Evict entries if needed
  private async evictIfNeeded(newEntrySize: number): Promise<void> {
    // Check size limit
    if (this.stats.size + newEntrySize > this.config.maxSize) {
      await this.evictBySize(newEntrySize);
    }

    // Check entry limit
    if (this.cache.size >= this.config.maxEntries) {
      await this.evictByCount();
    }
  }

  // Evict entries by size
  private async evictBySize(requiredSpace: number): Promise<void> {
    const entries = Array.from(this.cache.entries());
    
    // Sort by last accessed time (LRU)
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    let freedSpace = 0;
    for (const [key, entry] of entries) {
      if (freedSpace >= requiredSpace) break;
      
      this.cache.delete(key);
      this.stats.size -= entry.size;
      this.stats.evictions++;
      freedSpace += entry.size;
    }
  }

  // Evict entries by count
  private async evictByCount(): Promise<void> {
    const entries = Array.from(this.cache.entries());
    
    // Sort by last accessed time (LRU)
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // Remove oldest 10% of entries
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      const [key, entry] = entries[i];
      this.cache.delete(key);
      this.stats.size -= entry.size;
      this.stats.evictions++;
    }
  }

  // Compress value
  private async compress(value: any): Promise<Blob> {
    if (!this.compressionWorker) {
      throw new Error('Compression worker not available');
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36);
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data.id === id) {
          this.compressionWorker?.removeEventListener('message', handleMessage);
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      this.compressionWorker?.addEventListener('message', handleMessage);
      this.compressionWorker?.postMessage({ id, action: 'compress', data: value });
    });
  }

  // Decompress value
  private async decompress(blob: Blob): Promise<T> {
    if (!this.compressionWorker) {
      throw new Error('Compression worker not available');
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36);
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data.id === id) {
          this.compressionWorker?.removeEventListener('message', handleMessage);
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      this.compressionWorker?.addEventListener('message', handleMessage);
      this.compressionWorker?.postMessage({ id, action: 'decompress', data: blob });
    });
  }

  // Persist cache to storage
  private async persistToStorage(): Promise<void> {
    try {
      const cacheData = Array.from(this.cache.entries());
      const serialized = JSON.stringify(cacheData);
      localStorage.setItem('therapy_smart_cache', serialized);
    } catch (error) {
      console.error('Failed to persist cache:', error);
    }
  }

  // Load cache from storage
  private async loadFromStorage(): Promise<void> {
    try {
      const serialized = localStorage.getItem('therapy_smart_cache');
      if (serialized) {
        const cacheData = JSON.parse(serialized);
        for (const [key, entry] of cacheData) {
          // Check if entry is still valid
          if (!this.isExpired(entry)) {
            this.cache.set(key, entry);
            this.stats.size += entry.size;
          }
        }
        this.stats.entries = this.cache.size;
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  }

  // Start cleanup timer
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  // Cleanup expired entries
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.stats.size -= entry.size;
        cleaned++;
      }
    }
    
    this.stats.entries = this.cache.size;
    
    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  // Destroy cache
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    if (this.compressionWorker) {
      this.compressionWorker.terminate();
      this.compressionWorker = null;
    }
    
    this.clear();
  }
}

// Create singleton instance
export const smartCache = new SmartCache();
export default smartCache;