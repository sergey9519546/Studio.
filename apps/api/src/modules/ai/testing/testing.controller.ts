import { Controller, Get, Post, Body } from '@nestjs/common';
import { PromptTesterService } from './prompt-tester.service';
import type { PromptTestCase } from './prompt-tester.service';
import { PROMPT_TEST_CASES, getTestCasesForTemplate } from './test-cases';

@Controller('testing')
export class TestingController {
    constructor(private promptTester: PromptTesterService) { }

    /**
     * Run all prompt tests
     */
    @Get('prompts/run-all')
    async runAllTests() {
        const results = await this.promptTester.runTestSuite(PROMPT_TEST_CASES);
        const stats = await this.promptTester.getSummaryStats(results);

        return {
            stats,
            results: results.map(r => ({
                name: r.testName,
                passed: r.passed,
                score: r.score,
                metrics: r.metrics,
            })),
        };
    }

    /**
     * Run tests for specific template
     */
    @Get('prompts/run-template/:template')
    async runTemplateTests(@Body('template') template: string) {
        const testCases = getTestCasesForTemplate(template);
        const results = await this.promptTester.runTestSuite(testCases);
        const stats = await this.promptTester.getSummaryStats(results);

        return { stats, results };
    }

    /**
     * Run single custom test
     */
    @Post('prompts/run-custom')
    async runCustomTest(@Body() testCase: PromptTestCase) {
        const results = await this.promptTester.runTestSuite([testCase]);
        return results[0];
    }
}
