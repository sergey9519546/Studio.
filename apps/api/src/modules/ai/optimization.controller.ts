import { Controller, Post, Body, Get } from '@nestjs/common';
import { AIUsageService } from '../monitoring/ai-usage.service';
import { PromptTesterService } from './testing/prompt-tester.service';
import { PROMPT_TEMPLATES } from './prompts/templates';

interface OptimizationResult {
    template: string;
    currentVersion: string;
    qualityScore: number;
    recommendations: string[];
    estimatedImprovement: string;
}

@Controller('ai/optimize')
export class OptimizationController {
    constructor(
        private readonly aiUsage: AIUsageService,
        private readonly promptTester: PromptTesterService,
    ) { }

    /**
     * Auto-optimize prompts based on quality metrics
     */
    @Post('prompts')
    async optimizePrompts(@Body() dto: { templates?: string[] }) {
        const templatesToTest = dto.templates || Object.keys(PROMPT_TEMPLATES);
        const results: OptimizationResult[] = [];

        for (const templateName of templatesToTest) {
            const template = PROMPT_TEMPLATES[templateName];
            if (!template) continue;

            // Run quality tests
            const testResults = await this.promptTester.runTestSuite([
                {
                    name: `${templateName}-quality-test`,
                    template: templateName,
                    input: { /* mock data */ },
                    expectedKeywords: ['performance', 'recommendation'],
                    minQualityScore: 0.7,
                },
            ]);

            const avgScore = testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length;

            results.push({
                template: templateName,
                currentVersion: template.version || '1.0',
                qualityScore: avgScore,
                recommendations: this.generateRecommendations(avgScore),
                estimatedImprovement: avgScore < 0.7 ? '15-20%' : '5-10%',
            });
        }

        return {
            success: true,
            analyzed: results.length,
            results,
            summary: this.generateOptimizationSummary(results),
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Get optimization recommendations
     */
    @Get('recommendations')
    async getRecommendations() {
        // Analyze recent AI usage patterns
        const recentUsage = await this.aiUsage.getStats({
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date(),
        });

        const totalCostNum = parseFloat(recentUsage.totalCost.replace('$', ''));
        const dailyAvg = totalCostNum / 7;
        const hitRateNum = typeof recentUsage.cacheHitRate === 'string'
            ? parseFloat(recentUsage.cacheHitRate)
            : recentUsage.cacheHitRate;

        return {
            caching: {
                status: hitRateNum > 50 ? 'healthy' : 'needs-improvement',
                hitRate: recentUsage.cacheHitRate,
                recommendation: hitRateNum < 50
                    ? 'Consider increasing cache TTL or reviewing query patterns'
                    : 'Cache performance is optimal',
            },
            costs: {
                dailyAvg: `$${dailyAvg.toFixed(2)}`,
                trend: 'stable', // Calculate from historical data
                recommendation: 'Consider using gemini-flash for simple queries',
            },
            prompts: {
                templatesInUse: Object.keys(PROMPT_TEMPLATES).length,
                recommendation: 'Run automated quality tests weekly',
            },
            timestamp: new Date().toISOString(),
        };
    }

    private generateRecommendations(score: number): string[] {
        const recs: string[] = [];

        if (score < 0.7) {
            recs.push('Add more specific examples to system prompt');
            recs.push('Clarify output format requirements');
            recs.push('Test with diverse input scenarios');
        } else if (score < 0.85) {
            recs.push('Fine-tune response structure guidelines');
            recs.push('Add edge case handling');
        } else {
            recs.push('Prompt is performing well');
            recs.push('Monitor for regression');
        }

        return recs;
    }

    private generateOptimizationSummary(results: OptimizationResult[]) {
        const avgScore = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;
        const needsWork = results.filter(r => r.qualityScore < 0.7).length;

        return {
            overallQuality: avgScore,
            templatesNeedingWork: needsWork,
            status: avgScore > 0.8 ? 'excellent' : avgScore > 0.7 ? 'good' : 'needs-improvement',
        };
    }
}
