import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserContextDto } from '../../dto/user-context.dto';

export const ExtractUserIfExistsFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext): UserContextDto | null => {
        const request: Request = context.switchToHttp().getRequest();

        const user = request.user;

        if (!user) {
            return null;
        }

        return user as UserContextDto;
    },
);
