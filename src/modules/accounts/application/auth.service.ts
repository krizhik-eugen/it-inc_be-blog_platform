import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { AccountsConfig } from '../config';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { UserDocument } from '../domain/user.entity';
import { EmailService } from '../../notifications/email.service';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private emailService: EmailService,
        private accountsConfig: AccountsConfig,
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

        const isValidPassword = await bcrypt.compare(
            password,
            user.passwordHash,
        );

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

        //TODO: check implementation with events
        await this.emailService.sendEmailConfirmationMessage(
            user.email,
            confirmationCode,
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

        await this.emailService.sendEmailPasswordRecoveryMessage(
            user.email,
            newRecoveryCode,
        );
    }
}
