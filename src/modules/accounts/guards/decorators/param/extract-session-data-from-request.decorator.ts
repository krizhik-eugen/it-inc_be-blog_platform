import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SessionContextDto } from '../../dto/session-context.dto';

export const ExtractSessionDataFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request: Request = context.switchToHttp().getRequest();

        const session = request.user;

        if (!session) {
            throw new Error('Session data is missing in the request!');
        }

        return session as SessionContextDto;
    },
);
