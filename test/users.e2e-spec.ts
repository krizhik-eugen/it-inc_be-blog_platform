import request from 'supertest';
import { App } from 'supertest/types';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersTestManager } from './helpers/users-test-manager';
import { initSettings, prefix } from './helpers/init-settings';
import { deleteAllData } from './helpers/delete-all-data';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from '../src/modules/accounts/constants';
import { AccountsConfig } from '../src/modules/accounts/config/accounts.config';
import { CreateUserDto } from '../src/modules/accounts/dto/create';
import { PaginatedViewDto } from '../src/core/dto';
import { MongoUserViewDto } from '../src/modules/accounts/api/dto/view-dto';

describe('users', () => {
    let app: INestApplication;
    let userTestManger: UsersTestManager;

    beforeAll(async () => {
        const result = await initSettings((moduleBuilder) =>
            moduleBuilder
                .overrideProvider(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
                .useFactory({
                    factory: (accountsConfig: AccountsConfig) => {
                        return new JwtService({
                            secret: accountsConfig.jwtSecret,
                            signOptions: { expiresIn: '2s' },
                        });
                    },
                    inject: [AccountsConfig],
                }),
        );
        app = result.app;
        userTestManger = result.userTestManger;
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await deleteAllData(app);
    });

    it('POST /users, should create user', async () => {
        const body: CreateUserDto = {
            login: 'name1',
            password: 'qwerty',
            email: 'email@email.em',
        };

        const response = await userTestManger.createUser(body);

        expect(response).toEqual({
            login: body.login,
            email: body.email,
            id: expect.any(String) as string,
            createdAt: expect.any(String) as string,
        });
    });

    it('GET /users, should get users with pagination', async () => {
        const users = await userTestManger.createSeveralUsers(12);
        const { body: responseBody } = (await request(
            app.getHttpServer() as App,
        )
            .get(`${prefix}/users?pageNumber=2&sortDirection=asc`)
            .auth('admin', 'qwerty')
            .expect(HttpStatus.OK)) as {
            body: PaginatedViewDto<MongoUserViewDto>;
        };

        expect(responseBody.totalCount).toBe(12);
        expect(responseBody.items).toHaveLength(2);
        expect(responseBody.pagesCount).toBe(2);
        expect(responseBody.items[1]).toEqual(users[users.length - 1]);
    });
});
