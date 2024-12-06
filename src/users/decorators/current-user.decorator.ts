import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return {
      email: request.user.email,
      _id: request.user.sub,
      fullname: request.user.fullname,
    };
  },
);
