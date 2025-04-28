import { config } from 'dotenv';
import { envFilePaths } from './env-file-paths';
config({
    path: envFilePaths,
});
import { DataSource, DataSourceOptions } from 'typeorm';

const migrationOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.POSTGRES_URL,
    migrations: [__dirname + '/migrations/*.ts'],
    entities: ['src/**/*.entity.ts'],
} as DataSourceOptions;

export default new DataSource(migrationOptions);
