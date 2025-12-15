import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * JWT payload user structure
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
 * Type for extractable user properties
 */
type UserPropertyValue = string | number | undefined;

/**
 * Custom decorator to extract current authenticated user from request
 * Can optionally extract a specific property from the user object
 * 
 * @example
 * // Get full user object
 * @CurrentUser() user: JwtPayloadUser
 * 
 * @example
 * // Get specific property
 * @CurrentUser('id') userId: string | number
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayloadUser | undefined, ctx: ExecutionContext): JwtPayloadUser | UserPropertyValue | null => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayloadUser }>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
