import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UnauthorizedDomainException } from '../../../../core/exceptions';
import { AccountsConfig } from '../../config';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private accountsConfig: AccountsConfig,
    ) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const authorizationHeader = request.headers.authorization;

        console.log('request path', request.path);

        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
            throw new UnauthorizedException();
        }

        const base64Credentials = authorizationHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString(
            'utf-8',
        );
        const [login, password] = credentials.split(':');

        if (
            login === this.accountsConfig.adminLogin &&
            password === this.accountsConfig.adminPassword
        ) {
            return true;
        } else {
            throw UnauthorizedDomainException.create(
                'Invalid admin credentials',
            );
        }
    }
}
