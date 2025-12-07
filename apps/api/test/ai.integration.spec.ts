import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GeminiAnalystService } from '../src/modules/ai/gemini-analyst.service';

describe('AI Extraction API (Integration)', () => {
    let app: INestApplication;

    // Mock Gemini service to avoid real API calls
    const mockGeminiService = {
        extractData: jest.fn().mockResolvedValue([
            { name: 'Project Alpha', client: 'Client A', budget: 50000 },
            { name: 'Project Beta', client: 'Client B', budget: 75000 },
        ]),
        chat: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(GeminiAnalystService)
            .useValue(mockGeminiService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/ai/extract', () => {
        it('should extract data from text prompt', () => {
            const prompt = 'Extract project information from this text';
            const schema = {
                type: 'ARRAY',
                items: {
                    type: 'OBJECT',
                    properties: {
                        name: { type: 'STRING' },
                        client: { type: 'STRING' },
                    },
                },
            };

            return request(app.getHttpServer())
                .post('/api/v1/ai/extract')
                .send({ prompt, schema })
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThan(0);
                    expect(mockGeminiService.extractData).toHaveBeenCalledWith(
                        prompt,
                        schema,
                        undefined,
                    );
                });
        });

        it('should handle file upload with extraction', async () => {
            const schema = { type: 'ARRAY' };

            return request(app.getHttpServer())
                .post('/api/v1/ai/extract')
                .field('prompt', 'Extract data from uploaded file')
                .field('schema', JSON.stringify(schema))
                .attach('files', Buffer.from('mock file content'), 'test.txt')
                .expect(200)
                .expect((res) => {
                    expect(mockGeminiService.extractData).toHaveBeenCalled();
                    const callArgs = mockGeminiService.extractData.mock.calls[0];
                    expect(callArgs[2]).toBeDefined(); // Files argument
                });
        });

        it('should reject request without prompt or files', () => {
            return request(app.getHttpServer())
                .post('/api/v1/ai/extract')
                .send({ prompt: '', schema: null })
                .expect(400);
        });

        it('should handle schema as JSON string', () => {
            const prompt = 'Test prompt';
            const schemaString = JSON.stringify({ type: 'ARRAY' });

            return request(app.getHttpServer())
                .post('/api/v1/ai/extract')
                .send({ prompt, schema: schemaString })
                .expect(200)
                .expect(() => {
                    const callArgs = mockGeminiService.extractData.mock.calls[0];
                    expect(typeof callArgs[1]).toBe('object'); // Schema should be parsed
                });
        });

        it('should handle extraction errors gracefully', () => {
            mockGeminiService.extractData.mockRejectedValueOnce(
                new Error('Gemini API error'),
            );

            return request(app.getHttpServer())
                .post('/api/v1/ai/extract')
                .send({ prompt: 'Test', schema: { type: 'ARRAY' } })
                .expect(500);
        });
    });

    describe('POST /api/v1/ai/chat', () => {
        it('should forward chat requests to Gemini service', () => {
            mockGeminiService.chat.mockResolvedValue({
                response: 'AI response here',
                conversationHistory: [],
            });

            return request(app.getHttpServer())
                .post('/api/v1/ai/chat')
                .send({
                    message: 'What projects are available?',
                    conversationHistory: [],
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('response');
                    expect(mockGeminiService.chat).toHaveBeenCalled();
                });
        });
    });
});
