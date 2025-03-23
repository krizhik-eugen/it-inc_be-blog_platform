// import { HttpStatus, INestApplication } from '@nestjs/common';
// import request from 'supertest';
// import { App } from 'supertest/types';
// import {
//     MongoMeViewDto,
//     SuccessLoginViewDto,
//     MongoUserViewDto,
// } from '../../src/modules/accounts/api/dto/view-dto';
// import { prefix } from './init-settings';

// export class AuthTestManager {
//     constructor(private app: INestApplication) {}

//     async login(
//         loginOrEmail: string,
//         password: string,
//         statusCode: number = HttpStatus.OK,
//     ): Promise<SuccessLoginViewDto> {
//         const response = await request(this.app.getHttpServer() as App)
//             .post(`${prefix}/auth/login`)
//             .send({ loginOrEmail, password })
//             .expect(statusCode);

//         return {
//             accessToken: (response.body as SuccessLoginViewDto).accessToken,
//         };
//     }

//     async me(
//         accessToken: string,
//         statusCode: number = HttpStatus.OK,
//     ): Promise<MongoMeViewDto> {
//         const response = await request(this.app.getHttpServer() as App)
//             .get(`${prefix}/auth/me`)
//             .auth(accessToken, { type: 'bearer' })
//             .expect(statusCode);

//         return response.body as MongoMeViewDto;
//     }

//     async loginSeveralUsers(
//         users: MongoUserViewDto[],
//     ): Promise<SuccessLoginViewDto[]> {
//         const loginPromises = users.map((user: MongoUserViewDto) =>
//             this.login(user.login, '123456789'),
//         );

//         return await Promise.all(loginPromises);
//     }
// }
