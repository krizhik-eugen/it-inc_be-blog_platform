import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { AccountsConfig } from '../config';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { UserDocument } from '../domain/user.entity';
import { CryptoService } from './crypto.service';
import { EventBus } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../domain/events/user-registered.event';
import { UserPasswordRecoveryEvent } from '../domain/events/user-password-recovery.event';

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
