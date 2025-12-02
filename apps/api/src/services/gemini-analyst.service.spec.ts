import { Test, TestingModule } from '@nestjs/testing';
import { GeminiAnalystService } from '../modules/ai/gemini-analyst.service';
import { ConfigService } from '@nestjs/config';
import { VertexAIService } from '../modules/ai/vertex-ai.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GeminiAnalystService', () => {
    let service: GeminiAnalystService;

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === 'GEMINI_API_KEY') return 'test-api-key';
            return undefined;
        }),
    };

    const mockVertexAIService = {
        chat: jest.fn(),
        extractData: jest.fn(),
        generateContent: jest.fn(),
    };

    const mockPrismaService = {
        project: {
            findUnique: jest.fn(),
        },
        freelancer: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GeminiAnalystService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: VertexAIService,
                    useValue: mockVertexAIService,
                },
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<GeminiAnalystService>(GeminiAnalystService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

