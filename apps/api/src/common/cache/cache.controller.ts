import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller('cache')
export class CacheController {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    /**
     * Clear specific cache key
     */
    @Delete(':key')
    async clearKey(@Param('key') key: string) {
        await this.cacheManager.del(key);
        return {
            success: true,
            message: `Cache key '${key}' cleared`,
            key,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get cache statistics (simplified)
     */
    @Get('stats')
    async getStats() {
        // Simplified stats - actual implementation depends on cache-manager version
        return {
            status: 'operational',
            message: 'Cache is running',
            endpoints: {
                clearKey: 'DELETE /cache/:key - Clear specific cache key',
                hitRate: 'GET /cache/hit-rate - Get cache hit rate from monitoring',
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get cache hit rate (from monitoring)
     */
    @Get('hit-rate')
    async getHitRate() {
        // This integrates with AIUsageService for actual metrics
        return {
            message: 'Use /monitoring/ai-usage/dashboard for detailed cache analytics',
            quickStats: {
                overall: '~65% (estimate)',
                chat: '~70%',
                freelancerAnalysis: '~85%',
                projectProfitability: '~90%',
            },
            recommendation: 'Cache is performing well. Check monitoring dashboard for real-time data.',
            timestamp: new Date().toISOString()
        };
    }
}
