import { Test, TestingModule } from '@nestjs/testing';
import { AIController } from './ai.controller';
import { GeminiAnalystService } from './gemini-analyst.service';
import { RAGService } from '../rag/rag.service';

describe('AIController', () => {
    let controller: AIController;

    const mockGeminiAnalystService = {
        chat: jest.fn(),
        extractData: jest.fn(),
        analyzeProjectProfitability: jest.fn(),
        analyzeFreelancerPerformance: jest.fn(),
        generateProjectBrief: jest.fn(),
        executeTool: jest.fn(),
    };

    const mockRAGService = {
        query: jest.fn(),
        getStats: jest.fn(),
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
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

