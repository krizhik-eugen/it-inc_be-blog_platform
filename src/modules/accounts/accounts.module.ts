import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccountsConfig } from './config';
import {
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants';
import { JwtStrategy, RefreshTokenStrategy } from './guards/bearer';
import { LocalStrategy } from './guards/local';
import {
    LoginUserUseCase,
    LogoutUserUseCase,
    PasswordRecoveryConfirmationUseCase,
    PasswordRecoveryUseCase,
    RegisterUserUseCase,
    RegistrationConfirmationUseCase,
    RegistrationEmailResendingUseCase,
    UpdateRefreshTokenUseCase,
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
import {
    UsersPostgresQueryRepository,
    UsersRepository,
    PostgresSessionsRepository,
    SessionsQueryRepository,
} from './infrastructure';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { UsersController } from './api/sa.users.controller';
import { GetSessionsQueryHandler } from './application/queries/security';
import { TypedJwtService } from './application/typedJwtService';
import { SessionsController } from './api/security.controller';
import {
    DeleteAllSessionsUseCase,
    DeleteSessionUseCase,
} from './application/use-cases/security';

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
    DeleteSessionUseCase,
    DeleteAllSessionsUseCase,
    UpdateRefreshTokenUseCase,
    LogoutUserUseCase,
] as Provider[];

const queries = [
    GetCurrentUserQueryHandler,
    GetUserByIdQueryHandler,
    GetUsersQueryHandler,
    GetSessionsQueryHandler,
] as Provider[];
const repositories = [
    UsersPostgresQueryRepository,
    UsersRepository,
    PostgresSessionsRepository,
    SessionsQueryRepository,
] as Provider[];
const strategies = [
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
] as Provider[];

@Module({
    imports: [JwtModule, NotificationsModule],
    controllers: [AuthController, UsersController, SessionsController],
    providers: [
        AccountsConfig,
        AuthService,
        {
            provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
            useFactory: (accountsConfig: AccountsConfig): TypedJwtService => {
                return new TypedJwtService({
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
            useFactory: (accountsConfig: AccountsConfig): TypedJwtService => {
                return new TypedJwtService({
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
    exports: [AccountsConfig, UsersRepository],
})
export class AccountsModule {}
