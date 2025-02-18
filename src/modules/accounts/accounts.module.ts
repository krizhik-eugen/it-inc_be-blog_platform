import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccountsConfig } from './config';
import {
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants';
import { UsersController } from './api/users.controller';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { UsersQueryRepository } from './infrastructure/queryRepositories/users.query-repository';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { RegistrationEmailResendingUseCase } from './application/use-cases/registration-email-resending.use-case';
import { PasswordRecoveryUseCase } from './application/use-cases/password-recovery.use-case';
import { PasswordRecoveryConfirmationUseCase } from './application/use-cases/password-recovery-confirmation.use-case';
import { RegistrationConfirmationUseCase } from './application/use-cases/registration-confirmation.use-case';
import { CryptoService } from './application/crypto.service';
import { GetCurrentUserQueryHandler } from './application/queries/auth/get-current-user.query-handler';
import { GetUserByIdQueryHandler } from './application/queries/users/get-user-by-id.query-handler';
import { GetUsersQueryHandler } from './application/queries/users/get-users.query-handler';

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
