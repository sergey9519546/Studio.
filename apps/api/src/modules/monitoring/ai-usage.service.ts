// Cost Monitoring Service - Complete Implementation

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface AIUsageRecord {
    endpoint: string;
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    cost?: number;
    duration: number;
    cached: boolean;
    userId?: string;
    projectId?: string;
}

@Injectable()
export class AIUsageService {
    constructor(private prisma: PrismaService) { }

    async logUsage(data: AIUsageRecord) {
        return this.prisma.aIUsage.create({
            data: {
                endpoint: data.endpoint,
                model: data.model || 'gemini-1.5-pro',
                inputTokens: data.inputTokens || 0,
                outputTokens: data.outputTokens || 0,
                cost: data.cost || 0,
                duration: data.duration,
                cached: data.cached,
                userId: data.userId,
                projectId: data.projectId,
            }
        });
    }

    async getStats(timeRange: { start: Date; end: Date }) {
        const usage = await this.prisma.aIUsage.findMany({
            where: {
                timestamp: {
                    gte: timeRange.start,
                    lte: timeRange.end
                }
            }
        });

        const uncachedRequests = usage.filter(u => !u.cached);
        const cachedRequests = usage.filter(u => u.cached);
        const avgCostPerUncached = uncachedRequests.length > 0
            ? uncachedRequests.reduce((sum, u) => sum + u.cost, 0) / uncachedRequests.length
            : 0.02;

        return {
            totalRequests: usage.length,
            cachedRequests: cachedRequests.length,
            uncachedRequests: uncachedRequests.length,
            cacheHitRate: usage.length > 0
                ? ((cachedRequests.length / usage.length * 100).toFixed(2) + '%')
                : '0%',
            totalCost: '$' + usage.reduce((sum, u) => sum + u.cost, 0).toFixed(4),
            costSaved: '$' + (cachedRequests.length * avgCostPerUncached).toFixed(4),
            avgDuration: usage.length > 0
                ? (usage.reduce((sum, u) => sum + u.duration, 0) / usage.length).toFixed(0) + 'ms'
                : '0ms',
            byEndpoint: this.groupByEndpoint(usage),
        };
    }

    private groupByEndpoint(usage: { endpoint: string; cost: number; duration: number; cached: boolean }[]) {
        const grouped = usage.reduce((acc, u) => {
            if (!acc[u.endpoint]) {
                acc[u.endpoint] = { count: 0, cost: 0, avgDuration: 0, cached: 0 };
            }
            acc[u.endpoint].count++;
            acc[u.endpoint].cost += u.cost;
            acc[u.endpoint].avgDuration += u.duration;
            if (u.cached) acc[u.endpoint].cached++;
            return acc;
        }, {} as Record<string, { count: number; cost: number; avgDuration: number; cached: number }>);

        Object.keys(grouped).forEach(key => {
            (grouped[key] as any).avgDuration = (grouped[key].avgDuration / grouped[key].count).toFixed(0) + 'ms';
            (grouped[key] as any).cost = '$' + grouped[key].cost.toFixed(4);
            (grouped[key] as any).cacheRate = ((grouped[key].cached / grouped[key].count) * 100).toFixed(1) + '%';
        });

        return grouped;
    }
}
