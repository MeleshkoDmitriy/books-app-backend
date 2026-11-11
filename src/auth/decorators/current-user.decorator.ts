import {
  createParamDecorator,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import type { SafeUser } from '@/users/users.types.js';

export const CurrentUser = createParamDecorator(
  (field: keyof SafeUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return field ? user[field] : user;
  },
);
