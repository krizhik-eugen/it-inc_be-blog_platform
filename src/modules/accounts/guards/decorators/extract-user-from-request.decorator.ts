import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserContextDto } from '../dto/user-context.dto';

export const ExtractUserFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request: Request = context.switchToHttp().getRequest();

        const user = request.user;

        if (!user) {
            throw new Error('there is no user in the request object!');
        }

        return user as UserContextDto;
    },
);
