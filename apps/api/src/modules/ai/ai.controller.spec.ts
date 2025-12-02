import { Test, TestingModule } from '@nestjs/testing';
import { AIController } from './ai.controller';
import { GeminiAnalystService } from './gemini-analyst.service';
import { RAGService } from '../rag/rag.service';
import { vi } from 'vitest';

describe('AIController', () => {
    let controller: AIController;

    const mockGeminiAnalystService = {
        chat: vi.fn(),
        extractData: vi.fn(),
        analyzeProjectProfitability: vi.fn(),
        analyzeFreelancerPerformance: vi.fn(),
        generateProjectBrief: vi.fn(),
        executeTool: vi.fn(),
    };

    const mockRAGService = {
        query: vi.fn(),
        getStats: vi.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AIController],
            providers: [
                {
                    provide: GeminiAnalystService,
                    useValue: mockGeminiAnalystService,
                },
                {
                    provide: RAGService,
                    useValue: mockRAGService,
                },
            ],
        }).compile();

        controller = module.get<AIController>(AIController);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});


