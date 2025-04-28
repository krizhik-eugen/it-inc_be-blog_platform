import { join } from 'path';

if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV is required');
}

export const envFilePaths = [
    process.env.ENV_FILE_PATH?.trim() || '', // To make possible to add custom env file path
    join(__dirname, `./envs/.env.${process.env.NODE_ENV}.local`),
    join(__dirname, `./envs/.env.${process.env.NODE_ENV}`),
    join(__dirname, `./envs/.env.production`),
];
