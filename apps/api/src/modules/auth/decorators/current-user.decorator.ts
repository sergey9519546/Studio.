import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayloadUser {
  id: string | number;
  email: string;
  name?: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayloadUser | undefined, ctx: ExecutionContext): JwtPayloadUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayloadUser;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
