import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccountsConfig } from './config';
import {
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants';
import { JwtStrategy } from './guards/bearer';
import { LocalStrategy } from './guards/local';
import {
    LoginUserUseCase,
    PasswordRecoveryConfirmationUseCase,
    PasswordRecoveryUseCase,
    RegisterUserUseCase,
    RegistrationConfirmationUseCase,
    RegistrationEmailResendingUseCase,
} from './application/use-cases/auth';
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
} from './application/use-cases/users';
import { GetCurrentUserQueryHandler } from './application/queries/auth';
import {
    GetUserByIdQueryHandler,
    GetUsersQueryHandler,
} from './application/queries/users';
import { AuthService } from './application/auth.service';
import { CryptoService } from './application/crypto.service';
import { UsersQueryRepository, UsersRepository } from './infrastructure';

import { User, UserSchema } from './domain/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { UsersController } from './api/users.controller';

const useCases = [
    RegistrationConfirmationUseCase,
    PasswordRecoveryConfirmationUseCase,
    PasswordRecoveryUseCase,
    LoginUserUseCase,
    RegisterUserUseCase,
    RegistrationEmailResendingUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
];

const queries = [
    GetCurrentUserQueryHandler,
    GetUserByIdQueryHandler,
    GetUsersQueryHandler,
];
const repositories = [UsersQueryRepository, UsersRepository];
const strategies = [LocalStrategy, JwtStrategy];

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule,
        NotificationsModule,
    ],
    controllers: [AuthController, UsersController],
    providers: [
        AccountsConfig,
        AuthService,
        {
            provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
            useFactory: (accountsConfig: AccountsConfig): JwtService => {
                return new JwtService({
                    secret: accountsConfig.jwtSecret,
                    signOptions: {
                        expiresIn: accountsConfig.accessTokenExpirationTime,
                    },
                });
            },
            inject: [AccountsConfig],
        },
        {
            provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
            useFactory: (accountsConfig: AccountsConfig): JwtService => {
                return new JwtService({
                    secret: accountsConfig.jwtSecret,
                    signOptions: {
                        expiresIn: accountsConfig.refreshTokenExpirationTime,
                    },
                });
            },
            inject: [AccountsConfig],
        },
        ...strategies,
        ...repositories,
        ...useCases,
        ...queries,
        CryptoService,
    ],
    exports: [UsersRepository, MongooseModule, AccountsConfig],
})
export class AccountsModule {}
