import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  avgTtl: number;
}

@Injectable()
export class ProjectCacheService {
  private readonly logger = new Logger(ProjectCacheService.name);
  private readonly DEFAULT_TTL = 3600; // 1 hour
  private readonly PROJECT_PREFIX = 'project:';

  // Cache statistics tracking
  private stats: Map<string, { hits: number; misses: number }> = new Map();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get cached value with project scoping
   */
  async get<T>(projectId: string, key: string): Promise<T | null> {
    const cacheKey = this.buildKey(projectId, key);
    
    try {
      const value = await this.cacheManager.get<T>(cacheKey);
      this.trackCacheAccess(projectId, !!value);
      return value || null;
    } catch (error) {
      this.logger.error(`Cache get error: ${cacheKey}`, error);
      return null;
    }
  }

  /**
   * Set cached value with project scoping
   */
  async set<T>(
    projectId: string, 
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    const cacheKey = this.buildKey(projectId, key);
    const ttl = options.ttl || this.DEFAULT_TTL;

    try {
      await this.cacheManager.set(cacheKey, value, ttl);
      
      // Track cache key for project (for bulk invalidation)
      await this.trackProjectKey(projectId, cacheKey, options.tags);
    } catch (error) {
      this.logger.error(`Cache set error: ${cacheKey}`, error);
    }
  }

  /**
   * Delete cached value
   */
  async delete(projectId: string, key: string): Promise<void> {
    const cacheKey = this.buildKey(projectId, key);
    
    try {
      await this.cacheManager.del(cacheKey);
      await this.untrackProjectKey(projectId, cacheKey);
    } catch (error) {
      this.logger.error(`Cache delete error: ${cacheKey}`, error);
    }
  }

  /**
   * Invalidate all cache for a project
   */
  async invalidateProject(projectId: string): Promise<number> {
    const keysToDelete = await this.getProjectKeys(projectId);
    let deletedCount = 0;

    for (const key of keysToDelete) {
      try {
        await this.cacheManager.del(key);
        deletedCount++;
      } catch (error) {
        this.logger.error(`Failed to delete cache key: ${key}`, error);
      }
    }

    // Clear the tracking set
    await this.cacheManager.del(this.buildProjectKeysSetKey(projectId));
    
    this.logger.log(`Invalidated ${deletedCount} cache keys for project ${projectId}`);
    return deletedCount;
  }

  /**
   * Invalidate cache by tag
   */
  async invalidateByTag(projectId: string, tag: string): Promise<number> {
    const tagKey = this.buildTagKey(projectId, tag);
    const keysWithTag = await this.cacheManager.get<string[]>(tagKey);
    let deletedCount = 0;

    if (keysWithTag) {
      for (const key of keysWithTag) {
        try {
          await this.cacheManager.del(key);
          deletedCount++;
        } catch (error) {
          this.logger.error(`Failed to delete cache key: ${key}`, error);
        }
      }
      await this.cacheManager.del(tagKey);
    }

    return deletedCount;
  }

  /**
   * Get or set with callback (cache-aside pattern)
   */
  async getOrSet<T>(
    projectId: string,
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(projectId, key);
    
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(projectId, key, value, options);
    return value;
  }

  /**
   * Cache project context
   */
  async cacheProjectContext<T>(
    projectId: string,
    userId: string,
    context: T
  ): Promise<void> {
    const key = `context:${userId}`;
    await this.set(projectId, key, context, { ttl: 3600, tags: ['context'] });
  }

  /**
   * Get cached project context
   */
  async getProjectContext<T>(projectId: string, userId: string): Promise<T | null> {
    const key = `context:${userId}`;
    return this.get<T>(projectId, key);
  }

  /**
   * Cache knowledge source embeddings
   */
  async cacheEmbedding(
    projectId: string,
    sourceId: string,
    embedding: number[]
  ): Promise<void> {
    const key = `embedding:${sourceId}`;
    await this.set(projectId, key, embedding, { ttl: 86400, tags: ['embeddings'] }); // 24 hours
  }

  /**
   * Get cached embedding
   */
  async getEmbedding(projectId: string, sourceId: string): Promise<number[] | null> {
    const key = `embedding:${sourceId}`;
    return this.get(projectId, key);
  }

  /**
   * Cache search results
   */
  async cacheSearchResults<T>(
    projectId: string,
    queryHash: string,
    results: T[]
  ): Promise<void> {
    const key = `search:${queryHash}`;
    await this.set(projectId, key, results, { ttl: 300, tags: ['search'] }); // 5 minutes
  }

  /**
   * Get cached search results
   */
  async getSearchResults<T>(projectId: string, queryHash: string): Promise<T[] | null> {
    const key = `search:${queryHash}`;
    return this.get<T[]>(projectId, key);
  }

  /**
   * Cache project metrics
   */
  async cacheMetrics<T>(projectId: string, metrics: T): Promise<void> {
    const key = 'metrics';
    await this.set(projectId, key, metrics, { ttl: 60, tags: ['metrics'] }); // 1 minute
  }

  /**
   * Get cached metrics
   */
  async getMetrics<T>(projectId: string): Promise<T | null> {
    return this.get<T>(projectId, 'metrics');
  }

  /**
   * Get cache statistics for a project
   */
  getCacheStats(projectId: string): CacheStats {
    const projectStats = this.stats.get(projectId) || { hits: 0, misses: 0 };
    const total = projectStats.hits + projectStats.misses;
    
    return {
      hits: projectStats.hits,
      misses: projectStats.misses,
      hitRate: total > 0 ? (projectStats.hits / total) * 100 : 0,
      size: 0, // Would need to implement size tracking
      avgTtl: this.DEFAULT_TTL,
    };
  }

  /**
   * Warm cache for a project (preload common data)
   */
  async warmCache(projectId: string): Promise<void> {
    this.logger.log(`Warming cache for project ${projectId}`);
    
    // This would preload commonly accessed data
    // Implementation depends on specific use cases
  }

  // Private helper methods

  private buildKey(projectId: string, key: string): string {
    return `${this.PROJECT_PREFIX}${projectId}:${key}`;
  }

  private buildProjectKeysSetKey(projectId: string): string {
    return `${this.PROJECT_PREFIX}${projectId}:__keys__`;
  }

  private buildTagKey(projectId: string, tag: string): string {
    return `${this.PROJECT_PREFIX}${projectId}:__tag__:${tag}`;
  }

  private async trackProjectKey(
    projectId: string, 
    key: string, 
    tags?: string[]
  ): Promise<void> {
    const setKey = this.buildProjectKeysSetKey(projectId);
    const existingKeys = (await this.cacheManager.get<string[]>(setKey)) || [];
    
    if (!existingKeys.includes(key)) {
      existingKeys.push(key);
      await this.cacheManager.set(setKey, existingKeys, 86400 * 7); // 7 days
    }

    // Track by tags
    if (tags) {
      for (const tag of tags) {
        const tagKey = this.buildTagKey(projectId, tag);
        const taggedKeys = (await this.cacheManager.get<string[]>(tagKey)) || [];
        
        if (!taggedKeys.includes(key)) {
          taggedKeys.push(key);
          await this.cacheManager.set(tagKey, taggedKeys, 86400 * 7);
        }
      }
    }
  }

  private async untrackProjectKey(projectId: string, key: string): Promise<void> {
    const setKey = this.buildProjectKeysSetKey(projectId);
    const existingKeys = (await this.cacheManager.get<string[]>(setKey)) || [];
    
    const index = existingKeys.indexOf(key);
    if (index > -1) {
      existingKeys.splice(index, 1);
      await this.cacheManager.set(setKey, existingKeys, 86400 * 7);
    }
  }

  private async getProjectKeys(projectId: string): Promise<string[]> {
    const setKey = this.buildProjectKeysSetKey(projectId);
    return (await this.cacheManager.get<string[]>(setKey)) || [];
  }

  private trackCacheAccess(projectId: string, hit: boolean): void {
    const stats = this.stats.get(projectId) || { hits: 0, misses: 0 };
    
    if (hit) {
      stats.hits++;
    } else {
      stats.misses++;
    }
    
    this.stats.set(projectId, stats);
  }
}
