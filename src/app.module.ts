import { configModule } from './config-module';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/config';
import { AppController } from './app.controller';
import { AccountsModule } from './modules/accounts/accounts.module';
import { PlatformModule } from './modules/platform/platform.module';
import { TestingModule } from './modules/testing/testing.module';

const imports = [
    // MongooseModule.forRootAsync({
    //     useFactory: (coreConfig: CoreConfig) => {
    //         return {
    //             uri: coreConfig.mongoURL,
    //             dbName: coreConfig.mongoDBName,
    //         };
    //     },
    //     inject: [CoreConfig],
    // }),
    // TypeOrmModule.forRoot({
    //     type: 'postgres',
    //     host: 'localhost',
    //     port: 5432,
    //     username: 'platform_admin',
    //     password: 'platform_admin',
    //     database: 'TestDB',
    //     autoLoadEntities: false,
    //     synchronize: false,
    // }),
    ThrottlerModule.forRoot([
        {
            ttl: 10000,
            limit: 5,
        },
    ]),
    AccountsModule,
    PlatformModule,
];

@Module({
    imports: [
        CoreModule,
        configModule,
        TypeOrmModule.forRootAsync({
            useFactory: (coreConfig: CoreConfig) => {
                return {
                    type: 'postgres',
                    // host: coreConfig.pgHost,
                    url: coreConfig.postgresURL,
                    // port: 5432,
                    // username: coreConfig.pgDBLogin,
                    // password: coreConfig.pgDBPassword,
                    // database: coreConfig.pgDBName,
                    autoLoadEntities: false,
                    synchronize: false,
                };
            },
            inject: [CoreConfig],
        }),
    ],
    controllers: [AppController],
})
export class AppModule {
    static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
        if (coreConfig.includeTestingModule) {
            imports.push(TestingModule);
        }
        return Promise.resolve({
            module: AppModule,
            imports,
        });
    }
}
