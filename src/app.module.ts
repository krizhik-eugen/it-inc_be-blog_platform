import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { AccountsModule } from './features/accounts/accounts.module';
import { PlatformModule } from './features/platform/platform.module';
import { TestingModule } from './features/testing/testing.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
            process.env.MONGO_URL ?? 'mongodb://localhost:27017', //TODO: move to app config
        ),
        AccountsModule,
        TestingModule,
        PlatformModule,
        CoreModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
