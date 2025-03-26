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
import { User } from '../domain/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private accountsConfig: AccountsConfig,
        private cryptoService: CryptoService,
        private eventBus: EventBus,
    ) {}

    async validateUser(
        loginOrEmail: string,
        password: string,
    ): Promise<UserContextDto | null> {
        const user =
            await this.usersRepository.findByLoginOrEmail(loginOrEmail);

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

    async sendEmailConfirmationMessageToUser(user: User): Promise<void> {
        const confirmationCode = randomUUID();

        const expirationDate = add(new Date(), {
            hours: this.accountsConfig.confirmationCodeExpirationTimeInHours,
        });

        await this.usersRepository.setConfirmationCode(
            user.id,
            confirmationCode,
            expirationDate,
        );

        await this.eventBus.publish(
            new UserRegisteredEvent(user.email, confirmationCode),
        );
    }

    async sendEmailPasswordRecoveryMessageToUser(user: User): Promise<void> {
        const newRecoveryCode = randomUUID();

        const expirationDate = add(new Date(), {
            hours: this.accountsConfig.recoveryCodeExpirationTimeInHours,
        });

        await this.usersRepository.setPasswordRecoveryCode(
            user.id,
            newRecoveryCode,
            expirationDate,
        );

        await this.eventBus.publish(
            new UserPasswordRecoveryEvent(user.email, newRecoveryCode),
        );
    }
}
