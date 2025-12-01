import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AIController } from './ai.controller';
import { GeminiAnalystService } from './gemini-analyst.service';

describe('AIController', () => {
    let controller: AIController;
    let geminiService: GeminiAnalystService;

    const mockGeminiService = {
        extractData: jest.fn(),
        chat: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AIController],
            providers: [
                {
                    provide: GeminiAnalystService,
                    useValue: mockGeminiService,
                },
            ],
        }).compile();

        controller = module.get<AIController>(AIController);
        geminiService = module.get<GeminiAnalystService>(GeminiAnalystService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('extract', () => {
        it('should successfully extract data with prompt and schema', async () => {
            const mockBody = {
                prompt: 'Extract project data',
                schema: { type: 'ARRAY', items: { type: 'OBJECT' } },
            };

            const mockFiles: Array<Express.Multer.File> = [
                {
                    fieldname: 'files',
                    originalname: 'test.xlsx',
                    encoding: '7bit',
                    mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    buffer: Buffer.from('mock file content'),
                    size: 1024,
                } as Express.Multer.File,
            ];

            const mockResult = [
                { name: 'Project 1', client: 'Client A' },
                { name: 'Project 2', client: 'Client B' },
            ];

            mockGeminiService.extractData.mockResolvedValue(mockResult);

            const result = await controller.extract(mockBody, mockFiles);

            expect(geminiService.extractData).toHaveBeenCalledWith(
                mockBody.prompt,
                mockBody.schema,
                mockFiles,
            );
            expect(result).toEqual(mockResult);
        });

        it('should handle schema as JSON string', async () => {
            const mockBody = {
                prompt: 'Extract data',
                schema: JSON.stringify({ type: 'ARRAY' }),
            };

            mockGeminiService.extractData.mockResolvedValue([]);

            await controller.extract(mockBody);

            expect(geminiService.extractData).toHaveBeenCalledWith(
                mockBody.prompt,
                { type: 'ARRAY' },
                undefined,
            );
        });

        it('should throw BadRequestException if prompt and files are missing', async () => {
            const mockBody = { prompt: '', schema: undefined };

            await expect(controller.extract(mockBody)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should work with files but no prompt', async () => {
            const mockBody = { prompt: '', schema: undefined };
            const mockFiles: Array<Express.Multer.File> = [
                {
                    fieldname: 'files',
                    originalname: 'test.pdf',
                    encoding: '7bit',
                    mimetype: 'application/pdf',
                    buffer: Buffer.from('mock file content'),
                    size: 1024,
                } as Express.Multer.File,
            ];

            mockGeminiService.extractData.mockResolvedValue([]);

            await controller.extract(mockBody, mockFiles);

            expect(geminiService.extractData).toHaveBeenCalledWith(
                mockBody.prompt,
                undefined,
                mockFiles,
            );
        });
    });

    describe('chat', () => {
        it('should forward chat request to service', async () => {
            const mockBody = {
                message: 'What projects are available?',
                conversationHistory: [],
                userId: 'user-123',
            };

            const mockResponse = {
                response: 'Here are the available projects...',
                conversationHistory: [
                    { role: 'user', content: 'What projects are available?' },
                    { role: 'assistant', content: 'Here are the available projects...' },
                ],
            };

            mockGeminiService.chat.mockResolvedValue(mockResponse);

            const result = await controller.chat(mockBody);

            expect(geminiService.chat).toHaveBeenCalledWith(
                mockBody.message,
                mockBody.conversationHistory,
                mockBody.userId,
                undefined,
                undefined,
            );
            expect(result).toEqual(mockResponse);
        });

        it('should handle invalid JSON string for additionalContext', async () => {
            const mockBody = {
                message: 'Test query',
                conversationHistory: [],
                additionalContext: 'invalid json',
            };

            mockGeminiService.chat.mockResolvedValue({ response: 'Response' });

            await controller.chat(mockBody);

            expect(geminiService.chat).toHaveBeenCalledWith(
                mockBody.message,
                mockBody.conversationHistory,
                undefined,
                undefined,
                'invalid json',
            );
        });
    });
});
