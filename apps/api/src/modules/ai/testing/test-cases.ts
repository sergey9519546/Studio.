import { PromptTestCase } from './prompt-tester.service';

/**
 * Test case library for prompt quality assurance
 */
export const PROMPT_TEST_CASES: PromptTestCase[] = [
    // Freelancer Analysis Tests
    {
        name: 'Freelancer Analysis - High Performer',
        template: 'freelancerAnalysis',
        input: {
            name: 'Alice Designer',
            projectCount: 12,
            avgRating: 4.8,
            skills: ['UI/UX', 'Figma', 'React'],
            recentProjects: [
                { title: 'Brand Redesign' },
                { title: 'Mobile App UI' },
            ],
        },
        expectedKeywords: ['performance', 'high', 'excellent'],
        expectedStructure: {
            performanceScore: 0,
            strengths: [],
            improvements: [],
            recommendation: '',
            nextSteps: [],
        },
        minQualityScore: 0.8,
    },

    {
        name: 'Freelancer Analysis - Average Performer',
        template: 'freelancerAnalysis',
        input: {
            name: 'Bob Developer',
            projectCount: 5,
            avgRating: 3.5,
            skills: ['JavaScript', 'Node.js'],
            recentProjects: [
                { title: 'API Integration' },
            ],
        },
        expectedKeywords: ['average', 'improvement', 'potential'],
        expectedStructure: {
            performanceScore: 0,
            strengths: [],
            improvements: [],
            recommendation: '',
            nextSteps: [],
        },
        minQualityScore: 0.75,
    },

    // Project Profitability Tests
    {
        name: 'Project Profitability - Profitable',
        template: 'projectProfitability',
        input: {
            title: 'E-commerce Redesign',
            budget: 50000,
            totalCost: 35000,
            profit: 15000,
            assignments: [
                { freelancer: { name: 'Alice' }, role: 'Designer' },
                { freelancer: { name: 'Bob' }, role: 'Developer' },
            ],
        },
        expectedKeywords: ['profitable', 'healthy', 'margin'],
        expectedStructure: {
            profitabilityScore: 0,
            summary: '',
            recommendations: [],
            riskFactors: [],
        },
        minQualityScore: 0.8,
    },

    {
        name: 'Project Profitability - Over Budget',
        template: 'projectProfitability',
        input: {
            title: 'Mobile App Development',
            budget: 30000,
            totalCost: 35000,
            profit: -5000,
            assignments: [
                { freelancer: { name: 'Charlie' }, role: 'Full Stack' },
            ],
        },
        expectedKeywords: ['over', 'budget', 'risk', 'concern'],
        expectedStructure: {
            profitabilityScore: 0,
            summary: '',
            recommendations: [],
            riskFactors: [],
        },
        minQualityScore: 0.75,
    },

    // Chat Tests
    {
        name: 'Chat - General Query',
        template: 'chat',
        input: 'What projects are currently active?',
        expectedKeywords: ['project', 'active'],
        minQualityScore: 0.7,
    },

    {
        name: 'Chat - Freelancer Query',
        template: 'chat',
        input: 'Who are our top performing freelancers?',
        expectedKeywords: ['freelancer', 'performance', 'top'],
        minQualityScore: 0.7,
    },
];

/**
 * Get test cases for specific template
 */
export function getTestCasesForTemplate(templateName: string): PromptTestCase[] {
    return PROMPT_TEST_CASES.filter(tc => tc.template === templateName);
}

/**
 * Get all templates being tested
 */
export function getTestedTemplates(): string[] {
    return [...new Set(PROMPT_TEST_CASES.map(tc => tc.template))];
}
