import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('validateUser', () => {
        it('should return user if credentials are valid', async () => {
            const mockUser = {
                id: 1,
                email: 'user@example.com',
                name: 'Test User',
                role: 'ADMIN',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.validateUser('user@example.com', 'password');

            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'user@example.com' },
            });
        });

        it('should return null if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.validateUser('nonexistent@example.com', 'password');

            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access token for valid user', async () => {
            const mockUser = {
                id: 1,
                email: 'user@example.com',
                name: 'Test User',
                role: 'ADMIN',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.login('user@example.com', 'password');

            expect(result.accessToken).toBe('mock-jwt-token');
            expect(result.user).toMatchObject({
                id: 1,
                email: 'user@example.com',
            });
            expect(jwtService.sign).toHaveBeenCalledWith({
                sub: 1,
                email: 'user@example.com',
            });
        });

        it('should throw UnauthorizedException for invalid credentials', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.login('invalid@example.com', 'wrong')).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('verifyToken', () => {
        it('should verify and decode valid token', async () => {
            const mockPayload = { sub: 1, email: 'user@example.com' };
            mockJwtService.verify.mockReturnValue(mockPayload);

            const result = await service.verifyToken('valid-token');

            expect(result).toEqual(mockPayload);
            expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
        });

        it('should throw error for invalid token', async () => {
            mockJwtService.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(service.verifyToken('invalid-token')).rejects.toThrow();
        });
    });
});
