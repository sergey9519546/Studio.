import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute - prevent brute force
    async login(@Body() req: { email: string; password: string }) {
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() req: { email: string; password: string; name?: string }) {
        const user = await this.authService.register(req.email, req.password, req.name);
        return this.authService.login(user);
    }
}
