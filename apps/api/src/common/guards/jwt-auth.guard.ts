import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Simple JWT Auth Guard
 * Validates that requests have a valid authorization token
 * For now, accepts any Bearer token to enable the authentication pattern
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

        request.user = {
            id: 1,
            email: 'user@example.com',
        };

        return true;
    }
}
