import { Test, TestingModule } from '@nestjs/testing';
import { FreelancersService } from './freelancers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ZaiService } from '../../common/ai/zai.service.js';

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
            upsert: jest.fn(),
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
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    },
                },
                {
                    provide: ZaiService,
                    useValue: {
                        parseResume: jest.fn(),
                    },
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
        it('should return all freelancers with flattened skills', async () => {
            const mockFreelancers = [
                { id: '1', name: 'John Doe', email: 'john@example.com', skills: [{ name: 'React' }, { name: 'Node.js' }] },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com', skills: [{ name: 'Design' }] },
            ];

            mockPrismaService.freelancer.findMany.mockResolvedValue(mockFreelancers);

            const result = await service.findAll();

            expect(prismaService.freelancer.findMany).toHaveBeenCalledWith({
                orderBy: { name: 'asc' },
            });

            expect(result).toEqual([
                { id: '1', name: 'John Doe', email: 'john@example.com', skills: ['React', 'Node.js'] },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com', skills: ['Design'] },
            ]);
        });

        it('should handle empty results', async () => {
            mockPrismaService.freelancer.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a freelancer by id with flattened skills', async () => {
            const mockFreelancer = {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                skills: [{ name: 'React' }, { name: 'TypeScript' }],
            };

            mockPrismaService.freelancer.findUnique.mockResolvedValue(mockFreelancer);

            const result = await service.findOne('1');

            expect(prismaService.freelancer.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });

            expect(result).toEqual({
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                skills: ['React', 'TypeScript'],
            });
        });

        it('should return null if freelancer not found', async () => {
            mockPrismaService.freelancer.findUnique.mockResolvedValue(null);

            const result = await service.findOne('999');

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new freelancer with skills', async () => {
            const createDto = {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                skills: ['React', 'Vue'],
            };

            const mockCreatedFreelancer = {
                id: '3',
                name: 'Alice Johnson',
                email: 'alice@example.com',
                skills: ['React', 'Vue'],
            };

            mockPrismaService.freelancer.create.mockResolvedValue(mockCreatedFreelancer);

            const result = await service.create(createDto);

            expect(prismaService.freelancer.create).toHaveBeenCalledWith({
                data: {
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    skills: ['React', 'Vue'],
                    status: undefined,
                },
            });

            expect(result).toEqual(mockCreatedFreelancer);
        });
    });

    describe('update', () => {
        it('should update an existing freelancer and replace skills', async () => {
            const updateDto = {
                name: 'John Updated',
                skills: ['Angular', 'TypeScript'],
            };

            const mockUpdatedFreelancer = {
                id: '1',
                name: 'John Updated',
                email: 'john@example.com',
                skills: ['Angular', 'TypeScript'],
            };

            mockPrismaService.freelancer.update.mockResolvedValue(mockUpdatedFreelancer);

            const result = await service.update('1', updateDto);

            expect(prismaService.freelancer.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: {
                    name: 'John Updated',
                    skills: ['Angular', 'TypeScript'],
                },
            });

            expect(result).toEqual(mockUpdatedFreelancer);
        });
    });

    describe('remove', () => {
        it('should delete a freelancer', async () => {
            const mockDeletedFreelancer = {
                id: '1',
                name: 'John Doe',
                skills: [],
            };

            mockPrismaService.freelancer.delete.mockResolvedValue(mockDeletedFreelancer);

            const result = await service.remove('1');

            expect(prismaService.freelancer.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });

            expect(result).toEqual(mockDeletedFreelancer);
        });
    });
});
