import { DataSourceOptions } from 'typeorm';

console.log('OPTIONS.TS >>>>>>>>>>>>>>>>>>');

console.log(process.env.POSTGRES_URL);
console.log(process.env.NODE_ENV);

export const options: DataSourceOptions = {
    type: 'postgres',
    url: process.env.POSTGRES_URL,
    //host: 'localhost',
    //port: 5532,
    //username: process.env.POSTGRE_USER_NAME,
    //password: process.env.POSTGRE_USER_PASSWORD,
    //database: process.env.POSTGRE_DB_NAME, // 'TypeOrmMigrationLesson',
    //database: 'TypeOrmMigrationNew',

    synchronize: false,
    logging: true,
};
