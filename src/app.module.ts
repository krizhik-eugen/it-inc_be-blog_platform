import { configModule } from './config-module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { PlatformModule } from './modules/platform/platform.module';
import { TestingModule } from './modules/testing/testing.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        configModule,
        MongooseModule.forRoot(
            process.env.MONGO_URL ?? 'mongodb://localhost', //TODO: move to app config
        ),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        AccountsModule,
        TestingModule,
        PlatformModule,
        CoreModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
