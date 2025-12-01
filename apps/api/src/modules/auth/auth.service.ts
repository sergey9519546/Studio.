import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    /**
     * Validate user credentials
     */
    async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return null;
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        // Return user without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Register a new user
     */
    async register(email: string, password: string, name?: string): Promise<Omit<User, 'password'>> {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new UnauthorizedException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Return user without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Generate JWT token for user
     */
    async login(user: Omit<User, 'password'>) {
        const payload = {
            email: user.email,
            sub: user.id,
            name: user.name,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: user,
        };
    }

    /**
     * Seed initial admin user if no users exist
     * This should only be called in development/initial setup
     */
    async seedAdminUser(): Promise<void> {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@studio.com';
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.warn('ADMIN_PASSWORD not set in environment. Skipping admin user seed.');
            return;
        }

        // Check if any users exist
        const userCount = await this.prisma.user.count();
        if (userCount > 0) {
            console.log('Users already exist. Skipping admin seed.');
            return;
        }

        // Create admin user
        await this.register(adminEmail, adminPassword, 'Studio Admin');
        console.log(`Admin user created: ${adminEmail}`);
    }
}
