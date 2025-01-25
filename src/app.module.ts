import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { mongoDBUrl, mongoDBName } from './app-settings';
import { CoreModule } from './core/core.module';
import { AccountsModule } from './features/accounts/accounts.module';
import { PlatformModule } from './features/platform/platform.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(`${mongoDBUrl}/${mongoDBName}`),
        AccountsModule,
        PlatformModule,
        CoreModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
