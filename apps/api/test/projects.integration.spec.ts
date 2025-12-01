import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Projects API (Integration)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prismaService = moduleFixture.get<PrismaService>(PrismaService);
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/projects', () => {
        it('should create a new project', () => {
            const createDto = {
                title: 'Test Project',
                client: 'Test Client',
                description: 'Integration test project',
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                roleRequirements: [
                    { role: 'Developer', count: 2 },
                    { role: 'Designer', count: 1 },
                ],
            };

            return request(app.getHttpServer())
                .post('/api/projects')
                .send(createDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.name).toBe('Test Project');
                    expect(res.body.clientName).toBe('Test Client');
                });
        });

        it('should reject incomplete project data', () => {
            return request(app.getHttpServer())
                .post('/api/projects')
                .send({ title: 'Incomplete' })
                .expect(400);
        });
    });

    describe('GET /api/projects', () => {
        it('should return paginated projects', () => {
            return request(app.getHttpServer())
                .get('/api/projects?page=1&limit=10')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('total');
                    expect(res.body).toHaveProperty('page');
                    expect(res.body).toHaveProperty('limit');
                    expect(res.body).toHaveProperty('data');
                    expect(Array.isArray(res.body.data)).toBe(true);
                });
        });

        it('should apply pagination correctly', () => {
            return request(app.getHttpServer())
                .get('/api/projects?page=1&limit=5')
                .expect(200)
                .expect((res) => {
                    expect(res.body.limit).toBe(5);
                    expect(res.body.data.length).toBeLessThanOrEqual(5);
                });
        });
    });

    describe('GET /api/projects/:id', () => {
        it('should return a project by id', async () => {
            const createRes = await request(app.getHttpServer())
                .post('/api/projects')
                .send({
                    title: 'Findable Project',
                    client: 'Test Client',
                    description: 'Test',
                    startDate: '2025-01-01',
                });

            const projectId = createRes.body.id;

            return request(app.getHttpServer())
                .get(`/api/projects/${projectId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(projectId);
                    expect(res.body.name).toBe('Findable Project');
                });
        });

        it('should return 404 for non-existent project', () => {
            return request(app.getHttpServer())
                .get('/api/projects/99999')
                .expect(404);
        });
    });

    describe('PUT /api/projects/:id', () => {
        it('should update an existing project', async () => {
            const createRes = await request(app.getHttpServer())
                .post('/api/projects')
                .send({
                    title: 'Original Title',
                    client: 'Original Client',
                    description: 'Test',
                    startDate: '2025-01-01',
                });

            const projectId = createRes.body.id;
            const updateDto = {
                title: 'Updated Title',
                client: 'Updated Client',
            };

            return request(app.getHttpServer())
                .put(`/api/projects/${projectId}`)
                .send(updateDto)
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toBe('Updated Title');
                    expect(res.body.clientName).toBe('Updated Client');
                });
        });
    });

    describe('DELETE /api/projects/:id', () => {
        it('should delete a project', async () => {
            const createRes = await request(app.getHttpServer())
                .post('/api/projects')
                .send({
                    title: 'To Be Deleted',
                    client: 'Test Client',
                    description: 'Test',
                    startDate: '2025-01-01',
                });

            const projectId = createRes.body.id;

            return request(app.getHttpServer())
                .delete(`/api/projects/${projectId}`)
                .expect(200);
        });
    });
});
