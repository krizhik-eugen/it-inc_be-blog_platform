import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

export const configModule = ConfigModule.forRoot({
    envFilePath: [
        process.env.ENV_FILE_PATH?.trim() || '', // To make possible to add custom env file path
        join(__dirname, `./envs/.env.${process.env.NODE_ENV}.local`),
        join(__dirname, `./envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, `./envs/.env.production`),
    ],
    isGlobal: true,
});
