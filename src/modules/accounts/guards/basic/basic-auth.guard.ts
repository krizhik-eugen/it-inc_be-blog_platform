import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AccountsConfig } from '../../config/accounts.config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private accountsConfig: AccountsConfig,
    ) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const authorizationHeader = request.headers.authorization;

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
            throw new UnauthorizedException();
        }
    }
}
