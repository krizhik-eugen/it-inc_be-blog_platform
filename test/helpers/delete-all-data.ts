import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { prefix } from './init-settings';

export const deleteAllData = async (app: INestApplication) => {
    return request(app.getHttpServer() as App).delete(
        `${prefix}/testing/all-data`,
    );
};
