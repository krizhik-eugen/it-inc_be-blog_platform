import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { AccountsConfig } from '../config';
import { UserContextDto } from '../guards/dto';
import { CryptoService } from './crypto.service';
import { UsersRepository } from '../infrastructure';
import {
    UserPasswordRecoveryEvent,
    UserRegisteredEvent,
} from '../domain/events';
import { PostgresUser } from '../domain/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersPostgresRepository: UsersRepository,
        private accountsConfig: AccountsConfig,
        private cryptoService: CryptoService,
        private eventBus: EventBus,
    ) {}

    async validateUser(
        loginOrEmail: string,
        password: string,
    ): Promise<UserContextDto | null> {
        const user =
            await this.usersPostgresRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            return null;
        }

        const isValidPassword = await this.cryptoService.comparePasswords({
            password,
            hash: user.password_hash,
        });

        if (!isValidPassword) {
            return null;
        }

        return { id: user.id };
    }

    async sendEmailConfirmationMessageToUser(
        user: PostgresUser,
    ): Promise<void> {
        const confirmationCode = randomUUID();

        const expirationDate = add(new Date(), {
            hours: this.accountsConfig.confirmationCodeExpirationTimeInHours,
        });

        await this.usersPostgresRepository.setConfirmationCode(
            user.id,
            confirmationCode,
            expirationDate,
        );

        await this.eventBus.publish(
            new UserRegisteredEvent(user.email, confirmationCode),
        );
    }

    async sendEmailPasswordRecoveryMessageToUser(
        user: PostgresUser,
    ): Promise<void> {
        const newRecoveryCode = randomUUID();

        const expirationDate = add(new Date(), {
            hours: this.accountsConfig.recoveryCodeExpirationTimeInHours,
        });

        await this.usersPostgresRepository.setPasswordRecoveryCode(
            user.id,
            newRecoveryCode,
            expirationDate,
        );

        await this.eventBus.publish(
            new UserPasswordRecoveryEvent(user.email, newRecoveryCode),
        );
    }
}
