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

    describe('/api/v1/health (GET)', () => {
        it('should return 200 OK with health status', () => {
            return request(app.getHttpServer())
                .get('/api/v1/health')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('status');
                    expect(res.body.status).toBe('ok');
                });
        });
    });

});
