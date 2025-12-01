import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/health (GET)', () => {
        it('should return 200 OK with health status', () => {
            return request(app.getHttpServer())
                .get('/api/health')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('status');
                    expect(res.body.status).toBe('ok');
                });
        });
    });

    describe('/api/ai/extract (POST)', () => {
        it('should reject request without prompt or files', () => {
            return request(app.getHttpServer())
                .post('/api/ai/extract')
                .send({ prompt: '', schema: null })
                .expect(400);
        });

        it('should accept request with valid prompt', () => {
            return request(app.getHttpServer())
                .post('/api/ai/extract')
                .send({
                    prompt: 'Extract test data',
                    schema: { type: 'ARRAY' },
                })
                .expect(200);
        });
    });
});
