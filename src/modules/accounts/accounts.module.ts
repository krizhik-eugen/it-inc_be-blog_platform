import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { UsersQueryRepository } from './infrastructure/queryRepositories/users.query-repository';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { ACCESS_TOKEN_EXPIRATION_TIME } from '../../constants';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module';
import { AccountsConfig } from './accounts.config';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME },
            }),
        }),
        NotificationsModule,
    ],
    controllers: [AuthController, UsersController],
    providers: [
        AccountsConfig,
        AuthService,
        UsersService,
        UsersQueryRepository,
        UsersRepository,
        LocalStrategy,
        JwtStrategy,
    ],
    exports: [UsersRepository, MongooseModule],
})
export class AccountsModule {}
