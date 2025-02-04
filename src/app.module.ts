import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { PlatformModule } from './modules/platform/platform.module';
import { TestingModule } from './modules/testing/testing.module';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot(),
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
