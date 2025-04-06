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
    UsersQueryRepository,
    UsersRepository,
    SessionsRepository,
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
import { UserEntity } from './domain/user.entity';
import { EmailConfirmationEntity } from './domain/email-confirmation.entity';
import { PasswordRecoveryEntity } from './domain/password-recovery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './application/users.service';
import { SessionEntity } from './domain/session.entity';

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
    UsersQueryRepository,
    UsersRepository,
    SessionsRepository,
    SessionsQueryRepository,
] as Provider[];
const strategies = [
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
] as Provider[];

@Module({
    imports: [
        JwtModule,
        NotificationsModule,
        TypeOrmModule.forFeature([
            UserEntity,
            EmailConfirmationEntity,
            PasswordRecoveryEntity,
            SessionEntity,
        ]),
    ],
    controllers: [AuthController, UsersController, SessionsController],
    providers: [
        AccountsConfig,
        AuthService,
        UsersService,
        CryptoService,
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
    ],
    exports: [AccountsConfig, UsersService],
})
export class AccountsModule {}
