// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Request } from 'express';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class BasicAuthGuard implements CanActivate {
//     constructor(private reflector: Reflector) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest<Request>();
//         const authorizationHeader = request.headers.authorization;

//         if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
//             throw UnauthorizedDomainException.create();
//         }

//         const base64Credentials = authorizationHeader.split(' ')[1];
//         const credentials = Buffer.from(base64Credentials, 'base64').toString(
//             'utf-8',
//         );
//         const [login, password] = credentials.split(':');

//         if (login === process.env.LOGIN && password === process.env.PASSWORD) {
//             return true;
//         } else {
//             throw UnauthorizedDomainException.create();
//         }
//     }
// }
