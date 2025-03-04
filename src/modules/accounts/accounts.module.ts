import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    UsersMongoQueryRepository,
    UsersMongoRepository,
    SessionsRepository,
    SessionsQueryRepository,
    UsersPostgresQueryRepository,
} from './infrastructure';
import { MongoUser, MongoUserSchema } from './domain/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { UsersController } from './api/users.controller';
import { Session, SessionSchema } from './domain/session.entity';
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
    UsersMongoQueryRepository,
    UsersMongoRepository,
    SessionsRepository,
    SessionsQueryRepository,
    UsersPostgresQueryRepository
] as Provider[];
const strategies = [
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
] as Provider[];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MongoUser.name, schema: MongoUserSchema },
            { name: Session.name, schema: SessionSchema },
        ]),
        JwtModule,
        NotificationsModule,
    ],
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
    exports: [UsersMongoRepository, MongooseModule, AccountsConfig],
})
export class AccountsModule {}
