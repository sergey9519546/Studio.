import { Test, TestingModule } from '@nestjs/testing';
import { FreelancersService } from './freelancers.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FreelancersService', () => {
    let service: FreelancersService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        freelancer: {
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
                FreelancersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<FreelancersService>(FreelancersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return paginated freelancers with correct skip and take', async () => {
            const mockFreelancers = [
                { id: '1', name: 'John Doe', role: 'Developer', rate: 100, availability: 'AVAILABLE' },
                { id: '2', name: 'Jane Smith', role: 'Designer', rate: 80, availability: 'BUSY' },
            ];

            mockPrismaService.freelancer.count.mockResolvedValue(10);
            mockPrismaService.freelancer.findMany.mockResolvedValue(mockFreelancers);

            const result = await service.findAll(1, 5);

            expect(prismaService.freelancer.count).toHaveBeenCalledTimes(1);
            expect(prismaService.freelancer.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: 5,
                orderBy: { updatedAt: 'desc' },
            });

            expect(result).toEqual({
                total: 10,
                page: 1,
                limit: 5,
                data: mockFreelancers,
            });
        });

        it('should handle empty results', async () => {
            mockPrismaService.freelancer.count.mockResolvedValue(0);
            mockPrismaService.freelancer.findMany.mockResolvedValue([]);

            const result = await service.findAll(1, 10);

            expect(result.data).toEqual([]);
            expect(result.total).toBe(0);
        });
    });

    describe('create', () => {
        it('should create a new freelancer', async () => {
            const createDto = {
                name: 'Alice Johnson',
                contactInfo: 'alice@example.com',
                role: 'Developer',
                rate: 120,
            };

            const mockCreatedFreelancer = {
                id: '3',
                ...createDto,
                availability: 'AVAILABLE',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaService.freelancer.create.mockResolvedValue(mockCreatedFreelancer);

            const result = await service.create(createDto);

            expect(prismaService.freelancer.create).toHaveBeenCalledWith({
                data: createDto,
            });
            expect(result).toEqual(mockCreatedFreelancer);
        });
    });

    describe('update', () => {
        it('should update an existing freelancer', async () => {
            const updateDto = {
                rate: 150,
                availability: 'BUSY',
            };

            const mockUpdatedFreelancer = {
                id: '1',
                name: 'John Doe',
                role: 'Developer',
                ...updateDto,
            };

            mockPrismaService.freelancer.update.mockResolvedValue(mockUpdatedFreelancer);

            const result = await service.update('1', updateDto);

            expect(prismaService.freelancer.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: updateDto,
            });
            expect(result).toEqual(mockUpdatedFreelancer);
        });
    });

    describe('findOne', () => {
        it('should return a freelancer by id', async () => {
            const mockFreelancer = {
                id: '1',
                name: 'John Doe',
                role: 'Developer',
                rate: 100,
            };

            mockPrismaService.freelancer.findUnique.mockResolvedValue(mockFreelancer);

            const result = await service.findOne('1');

            expect(prismaService.freelancer.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
            expect(result).toEqual(mockFreelancer);
        });

        it('should return null if freelancer not found', async () => {
            mockPrismaService.freelancer.findUnique.mockResolvedValue(null);

            const result = await service.findOne('999');

            expect(result).toBeNull();
        });
    });
});
