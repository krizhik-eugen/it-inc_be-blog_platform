// import request from 'supertest';
// import { App } from 'supertest/types';
// import { HttpStatus, INestApplication } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersTestManager } from './helpers/users-test-manager';
// import { initSettings, prefix } from './helpers/init-settings';
// import { deleteAllData } from './helpers/delete-all-data';
// import { delay } from './helpers/delay';
// import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from '../src/modules/accounts/constants';
// import { AccountsConfig } from '../src/modules/accounts/config/accounts.config';
// import { CreateUserDto } from '../src/modules/accounts/dto/create';
// import { MongoMeViewDto } from '../src/modules/accounts/api/dto/view-dto';
// import { EmailService } from '../src/modules/notifications/email.service';
// import { AuthTestManager } from './helpers/auth-test-manager';

// describe('auth', () => {
//     let app: INestApplication;
//     let authTestManger: AuthTestManager;
//     let userTestManger: UsersTestManager;

//     beforeAll(async () => {
//         const result = await initSettings((moduleBuilder) =>
//             moduleBuilder
//                 .overrideProvider(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
//                 .useFactory({
//                     factory: (accountsConfig: AccountsConfig) => {
//                         return new JwtService({
//                             secret: accountsConfig.jwtSecret,
//                             signOptions: { expiresIn: '2s' },
//                         });
//                     },
//                     inject: [AccountsConfig],
//                 }),
//         );
//         app = result.app;
//         authTestManger = result.authTestManger;
//         userTestManger = result.userTestManger;
//     });

//     afterAll(async () => {
//         await app.close();
//     });

//     beforeEach(async () => {
//         await deleteAllData(app);
//     });

//     it('GET /auth/me, should return user info while "me" request with correct accessTokens', async () => {
//         const users = await userTestManger.createSeveralUsers(1);
//         const tokens = await authTestManger.loginSeveralUsers(users);

//         const responseBody = await authTestManger.me(tokens[0].accessToken);

//         expect(responseBody).toEqual({
//             login: expect.anything() as string,
//             userId: expect.anything() as string,
//             email: expect.anything() as string,
//         } as MongoMeViewDto);
//     });

//     it('GET /auth/me, shouldn\'t return user info with "me" request if accessTokens expired', async () => {
//         const users = await userTestManger.createSeveralUsers(1);
//         const tokens = await authTestManger.loginSeveralUsers(users);

//         await delay(2000);
//         await authTestManger.me(tokens[0].accessToken, HttpStatus.UNAUTHORIZED);
//     });

//     it('POST /auth/registration, should register user without sending confirmation email', async () => {
//         await request(app.getHttpServer() as App)
//             .post(`${prefix}/auth/registration`)
//             .send({
//                 email: 'email@email.em',
//                 password: '123123123',
//                 login: 'login123',
//             } as CreateUserDto)
//             .expect(HttpStatus.NO_CONTENT);
//     });

//     it('POST /auth/registration, should call email sending method while registration', async () => {
//         const sendEmailMethod = (app.get(
//             EmailService,
//         ).sendEmailConfirmationMessage = jest
//             .fn()
//             .mockImplementation(() => Promise.resolve()));

//         await request(app.getHttpServer() as App)
//             .post(`${prefix}/auth/registration`)
//             .send({
//                 email: 'email@email.em',
//                 password: '123123123',
//                 login: 'login123',
//             } as CreateUserDto)
//             .expect(HttpStatus.NO_CONTENT);

//         expect(sendEmailMethod).toHaveBeenCalled();
//     });
// });
