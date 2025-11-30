import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Simple JWT Auth Guard
 * Validates that requests have a valid authorization token
 * For now, accepts any Bearer token to enable the authentication pattern
 * TODO: Implement full JWT validation with @nestjs/jwt and @nestjs/passport
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header found');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid authorization format. Use: Bearer <token>');
        }

        // For now, accept any Bearer token and extract a user ID
        // In production, validate JWT signature and decode claims
        // TODO: Use @nestjs/jwt to verify token signature

        // Simple mock user extraction for development
        // In production, decode JWT to get actual user data
        request.user = {
            id: 'authenticated-user', // Extract from JWT payload in production
            email: 'user@example.com', // Extract from JWT payload in production
        };

        return true;
    }
}
