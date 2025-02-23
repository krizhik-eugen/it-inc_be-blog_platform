import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { delay } from './delay';
import { UserViewDto } from '../../src/modules/accounts/api/dto/view-dto';
import {
    CreateUserInputDto,
    UpdateUserInputDto,
} from '../../src/modules/accounts/api/dto/input-dto';
import { prefix } from './init-settings';

export class UsersTestManager {
    constructor(private app: INestApplication) {}

    async createUser(
        createModel: CreateUserInputDto,
        statusCode: number = HttpStatus.CREATED,
    ): Promise<UserViewDto> {
        const response = await request(this.app.getHttpServer() as App)
            .post(`${prefix}/users`)
            .send(createModel)
            .auth('admin', 'qwerty')
            .expect(statusCode);

        return response.body as UserViewDto;
    }

    async updateUser(
        userId: string,
        updateModel: UpdateUserInputDto,
        statusCode: number = HttpStatus.NO_CONTENT,
    ): Promise<UserViewDto> {
        const response = await request(this.app.getHttpServer() as App)
            .put(`${prefix}/users/${userId}`)
            .send(updateModel)
            .auth('admin', 'qwerty')
            .expect(statusCode);

        return response.body as UserViewDto;
    }

    async createSeveralUsers(count: number): Promise<UserViewDto[]> {
        const usersPromises = [] as Promise<UserViewDto>[];

        for (let i = 1; i <= count; i++) {
            await delay(50);
            const response = this.createUser({
                login: `test` + i,
                email: `test${i}@gmail.com`,
                password: '123456789',
            });
            usersPromises.push(response);
        }

        return Promise.all(usersPromises);
    }
}
