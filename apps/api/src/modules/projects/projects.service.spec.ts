import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../../prisma/prisma.service';

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
                { id: 1, title: 'Project 1', client: 'Client A', roleRequirements: [], knowledgeBase: [] },
                { id: 2, title: 'Project 2', client: 'Client B', roleRequirements: [], knowledgeBase: [] },
            ];

            mockPrismaService.project.count.mockResolvedValue(10);
            mockPrismaService.project.findMany.mockResolvedValue(mockProjects);

            const result = await service.findAll(2, 2);

            expect(prismaService.project.count).toHaveBeenCalledTimes(1);
            expect(prismaService.project.findMany).toHaveBeenCalledWith({
                skip: 2,
                take: 2,
                include: { roleRequirements: true, knowledgeBase: true },
                orderBy: { updatedAt: 'desc' },
            });

            expect(result).toEqual({
                total: 10,
                page: 2,
                limit: 2,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Project 1',
                        clientName: 'Client A',
                    }),
                    expect.objectContaining({
                        name: 'Project 2',
                        clientName: 'Client B',
                    }),
                ]),
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
            };

            mockPrismaService.project.count.mockResolvedValue(1);
            mockPrismaService.project.findMany.mockResolvedValue([mockProject]);

            const result = await service.findAll(1, 10);

            expect(result.data[0]).toMatchObject({
                id: 1,
                name: 'Test Project',
                clientName: 'Test Client',
                dueDate: '2025-12-31',
            });
        });
    });

    describe('findOne', () => {
        it('should return a single project by ID', async () => {
            const mockProject = {
                id: 1,
                title: 'Project 1',
                client: 'Client A',
                roleRequirements: [],
                knowledgeBase: [],
                moodboardItems: [],
            };

            mockPrismaService.project.findUnique.mockResolvedValue(mockProject);

            const result = await service.findOne(1);

            expect(prismaService.project.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    roleRequirements: true,
                    knowledgeBase: true,
                    moodboardItems: true,
                },
            });

            expect(result).toMatchObject({
                name: 'Project 1',
                clientName: 'Client A',
            });
        });

        it('should return null if project not found', async () => {
            mockPrismaService.project.findUnique.mockResolvedValue(null);

            const result = await service.findOne(999);

            expect(result).toBeNull();
        });
    });
});
