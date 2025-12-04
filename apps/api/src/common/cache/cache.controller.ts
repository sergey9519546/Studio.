import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller('cache')
export class CacheController {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    /**
     * Clear all cache
     */
    @Delete('clear')
    async clearAll() {
        await this.cacheManager.reset();
        return {
            success: true,
            message: 'All cache cleared',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Clear cache by pattern
     */
    @Delete('clear/:pattern')
    async clearPattern(@Param('pattern') pattern: string) {
        // Get all keys (cache-manager implementation dependent)
        const keys = await this.cacheManager.store.keys();
        let cleared = 0;

        for (const key of keys) {
            if (key.includes(pattern)) {
                await this.cacheManager.del(key);
                cleared++;
            }
        }

        return {
            success: true,
            message: `Cleared ${cleared} cache entries matching '${pattern}'`,
            pattern,
            cleared,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get cache statistics
     */
    @Get('stats')
    async getStats() {
        const keys = await this.cacheManager.store.keys();

        return {
            totalKeys: keys.length,
            patterns: {
                chat: keys.filter(k => k.includes('chat')).length,
                freelancer: keys.filter(k => k.includes('freelancer')).length,
                project: keys.filter(k => k.includes('project')).length,
                embeddings: keys.filter(k => k.includes('embedding')).length,
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get cache hit rate (from monitoring)
     */
    @Get('hit-rate')
    async getHitRate() {
        // This would integrate with AIUsageService
        return {
            overall: '65%', // Example - calculate from AIUsage
            byEndpoint: {
                chat: '70%',
                freelancerAnalysis: '85%',
                projectProfitability: '90%',
            },
            recommendation: 'Cache hit rate is healthy',
            timestamp: new Date().toISOString()
        };
    }
}
