import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoginUserInputDto } from '../../api/dto/input-dto/users.input-dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const loginUserInputDto = plainToInstance(
            LoginUserInputDto,
            request.body,
        );

        const errors = await validate(loginUserInputDto);
        if (errors.length > 0) {
            throw BadRequestDomainException.create(
                'Invalid input for loginOrEmail or password',
            );
        }

        await super.canActivate(context);

        return true;
    }
}
