import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');

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
        it('should return user without password if credentials are valid', async () => {
            const mockUser = {
                id: 1,
                email: 'user@example.com',
                name: 'Test User',
                password: 'hashedPassword123',
                googleAccessToken: null,
                googleRefreshToken: null,
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.validateUser('user@example.com', 'password');

            expect(result).toEqual({
                id: 1,
                email: 'user@example.com',
                name: 'Test User',
                googleAccessToken: null,
                googleRefreshToken: null,
            });
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'user@example.com' },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword123');
        });

        it('should return null if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.validateUser('nonexistent@example.com', 'password');

            expect(result).toBeNull();
        });

        it('should return null if password is invalid', async () => {
            const mockUser = {
                id: 1,
                email: 'user@example.com',
                password: 'hashedPassword123',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await service.validateUser('user@example.com', 'wrongpassword');

            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access token and user for valid user', async () => {
            const mockUser = {
                id: 1,
                email: 'user@example.com',
                name: 'Test User',
                googleAccessToken: null,
                googleRefreshToken: null,
            };

            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.login(mockUser);

            expect(result.accessToken).toBe('mock-jwt-token');
            expect(result.user).toMatchObject({
                id: 1,
                email: 'user@example.com',
            });
            expect(jwtService.sign).toHaveBeenCalledWith({
                email: 'user@example.com',
                sub: 1,
                name: 'Test User',
            });
        });
    });

    describe('register', () => {
        it('should create a new user with hashed password', async () => {
            const mockCreatedUser = {
                id: 2,
                email: 'newuser@example.com',
                name: 'New User',
                password: 'hashedPassword456',
                googleAccessToken: null,
                googleRefreshToken: null,
            };

            mockPrismaService.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword456');
            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

            const result = await service.register('newuser@example.com', 'plainPassword', 'New User');

            expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'newuser@example.com',
                    password: 'hashedPassword456',
                    name: 'New User',
                },
            });
            expect(result).toEqual({
                id: 2,
                email: 'newuser@example.com',
                name: 'New User',
                googleAccessToken: null,
                googleRefreshToken: null,
            });
        });

        it('should throw UnauthorizedException if user already exists', async () => {
            const existingUser = {
                id: 1,
                email: 'existing@example.com',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

            await expect(service.register('existing@example.com', 'password')).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});
