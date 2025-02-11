import { AccountsConfig } from './config/accounts.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
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
import {
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/constants';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { RegistrationEmailResendingUseCase } from './application/use-cases/registration-email-resending.use-case';
import { PasswordRecoveryUseCase } from './application/use-cases/password-recovery.use-case';
import { PasswordRecoveryConfirmationUseCase } from './application/use-cases/password-recovery-confirmation.use-case';
import { RegistrationConfirmationUseCase } from './application/use-cases/registration-confirmation.use-case';

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
    ],
    exports: [UsersRepository, MongooseModule],
})
export class AccountsModule {}
