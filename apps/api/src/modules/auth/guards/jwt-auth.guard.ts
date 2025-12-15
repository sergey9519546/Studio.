import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JWT payload structure from authentication
 */
export interface JwtPayloadUser {
  id: string | number;
  email: string;
  name?: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

/**
 * Authentication error details
 */
interface AuthErrorInfo {
  message?: string;
  name?: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtPayloadUser>(
    err: Error | null,
    user: TUser | false,
    info: AuthErrorInfo | undefined
  ): TUser {
    if (err || !user) {
      const errorMessage = info?.message || 'Invalid or missing authentication token';
      throw err || new UnauthorizedException(errorMessage);
    }
    return user;
  }
}
