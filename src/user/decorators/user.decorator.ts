import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator to get user at any point
export const UserD = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      null;
    }
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
