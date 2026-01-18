import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AssetsService } from '../assets/assets.service.js';
import { GenAIService } from '../../common/ai/gen-ai.service.js';
import { ZaiService } from '../../common/ai/zai.service.js';

describe('ProjectsService', () => {
    let service: ProjectsService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        project: {
            count: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    },
                },
                { provide: AssetsService, useValue: {} },
                { provide: GenAIService, useValue: {} },
                { provide: ZaiService, useValue: {} },
            ],
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return paginated projects with correct skip and take', async () => {
            const mockProjects = [
                { id: '1', title: 'Project 1', client: 'Client A', roleRequirements: [], knowledgeBase: [], endDate: null, updatedAt: new Date() },
                { id: '2', title: 'Project 2', client: 'Client B', roleRequirements: [], knowledgeBase: [], endDate: null, updatedAt: new Date() },
            ];

            mockPrismaService.project.count.mockResolvedValue(10);
            mockPrismaService.project.findMany.mockResolvedValue(mockProjects);

            const result = await service.findAll(2, 2);

            expect(prismaService.project.count).toHaveBeenCalledTimes(1);
            expect(prismaService.project.findMany).toHaveBeenCalledWith({
                skip: 2,  // (page - 1) * limit = (2 - 1) * 2 = 2
                take: 2,
                include: { roleRequirements: true },
                orderBy: { updatedAt: 'desc' },
            });

            // Verify response structure matches actual service implementation
            expect(result).toEqual({
                data: [
                    expect.objectContaining({
                        id: '1',
                        title: 'Project 1',
                        name: 'Project 1',  // DTO transformation
                        client: 'Client A',
                        clientName: 'Client A',  // DTO transformation
                    }),
                    expect.objectContaining({
                        id: '2',
                        title: 'Project 2',
                        name: 'Project 2',
                        client: 'Client B',
                        clientName: 'Client B',
                    }),
                ],
                meta: {
                    total: 10,
                    page: 2,
                    limit: 2,
                    lastPage: 5,  // Math.ceil(10 / 2) = 5
                },
            });
        });

        it('should apply DTO transformation correctly', async () => {
            const mockProject = {
                id: 1,
                title: 'Test Project',
                client: 'Test Client',
                endDate: '2025-12-31',
                roleRequirements: [],
                knowledgeBase: [],
                updatedAt: new Date(),
            };

            mockPrismaService.project.count.mockResolvedValue(1);
            mockPrismaService.project.findMany.mockResolvedValue([mockProject]);

            const result = await service.findAll(1, 10);

            // Verify DTO transformation: title->name, client->clientName, endDate->dueDate
            expect(result.data[0]).toMatchObject({
                id: 1,
                title: 'Test Project',
                name: 'Test Project',
                client: 'Test Client',
                clientName: 'Test Client',
                endDate: '2025-12-31',
                dueDate: '2025-12-31',
            });
        });
    });

    describe('findOne', () => {
        it('should return a single project by ID with DTO transformation', async () => {
            const mockProject = {
                id: '1',
                title: 'Project 1',
                client: 'Client A',
                endDate: null,
                roleRequirements: [],
                knowledgeBase: [],
                moodboardItems: [],
                scripts: [],
                assignments: [],
            };

            mockPrismaService.project.findUnique.mockResolvedValue(mockProject);

            const result = await service.findOne('1');

            expect(prismaService.project.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
                include: {
                    roleRequirements: true,
                    scripts: true,
                    assignments: true,
                },
            });

            expect(result).toMatchObject({
                id: '1',
                title: 'Project 1',
                name: 'Project 1',
                client: 'Client A',
                clientName: 'Client A',
            });
        });

        it('should return null if project not found', async () => {
            mockPrismaService.project.findUnique.mockResolvedValue(null);

            const result = await service.findOne('999');

            expect(result).toBeNull();
        });
    });
});
