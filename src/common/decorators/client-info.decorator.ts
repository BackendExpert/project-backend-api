import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientInfo = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        return {
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'] || '',
        };
    },
);