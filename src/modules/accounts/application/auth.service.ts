import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { AccountsConfig } from '../config';
import { UserContextDto } from '../guards/dto';
import { CryptoService } from './crypto.service';
import { UsersRepository } from '../infrastructure';
import { UserDocument } from '../domain/user.entity';
import {
    UserPasswordRecoveryEvent,
    UserRegisteredEvent,
} from '../domain/events';

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
            hash: user.passwordHash,
        });

        if (!isValidPassword) {
            return null;
        }

        return { id: user._id.toString() };
    }

    async sendEmailConfirmationMessageToUser(
        user: UserDocument,
    ): Promise<void> {
        const confirmationCode = randomUUID();

        const expirationDate = add(new Date(), {
            hours: this.accountsConfig.confirmationCodeExpirationTimeInHours,
        });
        user.setConfirmationCode(confirmationCode, expirationDate);
        await this.usersRepository.save(user);

        await this.eventBus.publish(
            new UserRegisteredEvent(user.email, confirmationCode),
        );
    }

    async sendEmailPasswordRecoveryMessageToUser(
        user: UserDocument,
    ): Promise<void> {
        const newRecoveryCode = randomUUID();

        const expirationDate = add(new Date(), {
            hours: this.accountsConfig.recoveryCodeExpirationTimeInHours,
        });

        user.setPasswordRecoveryCode(newRecoveryCode, expirationDate);
        await this.usersRepository.save(user);

        await this.eventBus.publish(
            new UserPasswordRecoveryEvent(user.email, newRecoveryCode),
        );
    }
}
