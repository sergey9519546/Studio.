import { Injectable, Logger } from '@nestjs/common';
import { VertexAIService } from '../vertex-ai.service';
import { PROMPT_TEMPLATES } from '../prompts/templates';

interface PromptTestCase {
    name: string;
    template: string;
    input: any;
    expectedKeywords?: string[];
    expectedStructure?: any;
    minQualityScore?: number;
}

interface TestResult {
    testName: string;
    passed: boolean;
    score: number;
    output: string;
    metrics: {
        keywordMatch: number;
        structureMatch: boolean;
        responseTime: number;
        cost: number;
    };
}

@Injectable()
export class PromptTesterService {
    private readonly logger = new Logger(PromptTesterService.name);

    constructor(private vertexAI: VertexAIService) { }

    /**
     * Run complete test suite
     */
    async runTestSuite(testCases: PromptTestCase[]): Promise<TestResult[]> {
        this.logger.log(`Running ${testCases.length} prompt tests...`);

        const results = [];
        for (const testCase of testCases) {
            const result = await this.runTest(testCase);
            results.push(result);
        }

        const passed = results.filter(r => r.passed).length;
        const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

        this.logger.log(`Test suite complete: ${passed}/${results.length} passed, avg score: ${avgScore.toFixed(2)}`);

        return results;
    }

    /**
     * Run single test case
     */
    private async runTest(testCase: PromptTestCase): Promise<TestResult> {
        const startTime = Date.now();

        try {
            // Get template
            const template = PROMPT_TEMPLATES[testCase.template];
            if (!template) {
                throw new Error(`Template '${testCase.template}' not found`);
            }

            const prompt = template.systemPrompt + '\n\n' + template.userPrompt(testCase.input);

            // Execute
            const output = await this.vertexAI.generateContent(prompt);
            const responseTime = Date.now() - startTime;

            // Evaluate
            const metrics = {
                keywordMatch: this.evaluateKeywords(output, testCase.expectedKeywords || []),
                structureMatch: this.evaluateStructure(output, testCase.expectedStructure),
                responseTime,
                cost: this.estimateCost(prompt, output),
            };

            const score = this.calculateScore(metrics);
            const passed = score >= (testCase.minQualityScore || 0.7);

            return {
                testName: testCase.name,
                passed,
                score,
                output: output.substring(0, 500), // Truncate for logging
                metrics,
            };
        } catch (error) {
            return {
                testName: testCase.name,
                passed: false,
                score: 0,
                output: `ERROR: ${error.message}`,
                metrics: {
                    keywordMatch: 0,
                    structureMatch: false,
                    responseTime: Date.now() - startTime,
                    cost: 0,
                },
            };
        }
    }

    /**
     * Evaluate keyword presence
     */
    private evaluateKeywords(output: string, keywords: string[]): number {
        if (keywords.length === 0) return 1;

        const found = keywords.filter(k =>
            output.toLowerCase().includes(k.toLowerCase())
        );

        return found.length / keywords.length;
    }

    /**
     * Validate JSON structure
     */
    private evaluateStructure(output: string, expectedStructure?: any): boolean {
        if (!expectedStructure) return true;

        try {
            const parsed = JSON.parse(output);
            return this.matchesStructure(parsed, expectedStructure);
        } catch {
            return false;
        }
    }

    /**
     * Check if object matches expected structure
     */
    private matchesStructure(obj: any, structure: any): boolean {
        for (const key in structure) {
            if (!(key in obj)) return false;

            if (typeof structure[key] === 'object' && !Array.isArray(structure[key])) {
                if (!this.matchesStructure(obj[key], structure[key])) return false;
            }
        }
        return true;
    }

    /**
     * Calculate overall quality score
     */
    private calculateScore(metrics: any): number {
        return (
            metrics.keywordMatch * 0.4 +
            (metrics.structureMatch ? 1 : 0) * 0.4 +
            (metrics.responseTime < 3000 ? 1 : 0.5) * 0.2
        );
    }

    /**
     * Estimate API cost
     */
    private estimateCost(prompt: string, output: string): number {
        const inputTokens = Math.ceil(prompt.length / 4);
        const outputTokens = Math.ceil(output.length / 4);
        return (inputTokens * 0.000125 + outputTokens * 0.000375);
    }

    /**
     * Get summary statistics
     */
    async getSummaryStats(results: TestResult[]) {
        return {
            total: results.length,
            passed: results.filter(r => r.passed).length,
            failed: results.filter(r => !r.passed).length,
            avgScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
            avgResponseTime: results.reduce((sum, r) => sum + r.metrics.responseTime, 0) / results.length,
            totalCost: results.reduce((sum, r) => sum + r.metrics.cost, 0),
        };
    }
}
