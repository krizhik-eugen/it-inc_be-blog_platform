import { configModule } from './config-module'; // config has to be imported first to load env variables

import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/config';
import { AppController } from './app.controller';
import { AccountsModule } from './modules/accounts/accounts.module';
import { PlatformModule } from './modules/platform/platform.module';
import { TestingModule } from './modules/testing/testing.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (coreConfig: CoreConfig) => {
                return {
                    uri: coreConfig.mongoURL,
                    dbName: coreConfig.mongoDBName,
                };
            },
            inject: [CoreConfig],
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        CoreModule,
        configModule,
        AccountsModule,
        PlatformModule,
    ],
    controllers: [AppController],
})
export class AppModule {
    static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
        const additionalModules: any[] = [];
        if (coreConfig.includeTestingModule) {
            additionalModules.push(TestingModule);
        }
        return Promise.resolve({
            module: AppModule,
            imports: additionalModules, // Add dynamic modules here
        });
    }
}
