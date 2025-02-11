import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { SuccessLoginViewDto } from '../api/dto/view-dto/success-login.view.dto';
import { CreateUserDto } from '../dto/create/create-user.dto';
import { User, UserModelType } from '../domain/user.entity';
import { UpdatePasswordDto } from '../dto/create/update-password.dto';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';
import { EmailService } from '../../notifications/email.service';
import { SALT_ROUNDS } from '../constants/constants';
import { add } from 'date-fns';
import { AccountsConfig } from '../config/accounts.config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
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

    async login(userId: string): Promise<SuccessLoginViewDto> {
        const payload = { id: userId };

        const accessToken = this.jwtService.sign(payload);

        return Promise.resolve({ accessToken });
    }

    async passwordRecovery(email: string): Promise<void> {
        const foundUser = await this.usersRepository.findByLoginOrEmail(email);
        if (foundUser) {
            const newRecoveryCode = randomUUID();

            const expirationDate = add(new Date(), {
                hours: this.accountsConfig.recoveryCodeExpirationTimeInHours,
            });

            foundUser.setPasswordRecoveryCode(newRecoveryCode, expirationDate);

            await this.usersRepository.save(foundUser);

            await this.emailService.sendEmailPasswordRecoveryMessage(
                email,
                newRecoveryCode,
            );
        }
    }

    async confirmPasswordRecovery(dto: UpdatePasswordDto): Promise<void> {
        const foundUser =
            await this.usersRepository.findUserByRecoveryCodeOrNotFoundFail(
                dto.recoveryCode,
            );

        const newPasswordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);

        foundUser.changePassword(dto.recoveryCode, newPasswordHash);

        await this.usersRepository.save(foundUser);
    }

    async confirmUserEmail(code: string): Promise<void> {
        const foundUser =
            await this.usersRepository.findUserByConfirmationCode(code);

        if (!foundUser) {
            throw BadRequestDomainException.create(
                'No user found for this confirmation code',
                'code',
            );
        }

        foundUser.confirmUserEmail(code);

        await this.usersRepository.save(foundUser);
    }

    async registerNewUser(dto: CreateUserDto): Promise<void> {
        const foundUserByLogin = await this.usersRepository.findByLoginOrEmail(
            dto.login,
        );
        const foundUserByEmail = await this.usersRepository.findByLoginOrEmail(
            dto.email,
        );

        if (foundUserByLogin || foundUserByEmail) {
            const fieldName = foundUserByLogin ? 'login' : 'email';
            let message = `User with this ${fieldName} already exists`;

            if (foundUserByLogin?.deletedAt || foundUserByEmail?.deletedAt) {
                message = `User with this ${fieldName} was in the system and has been deleted`;
            }

            throw BadRequestDomainException.create(message, fieldName);
        }

        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

        const newUser = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordHash,
        });

        const confirmationCode = randomUUID();

        const expirationDate = add(new Date(), {
            hours: this.accountsConfig.confirmationCodeExpirationTimeInHours,
        });

        newUser.setConfirmationCode(confirmationCode, expirationDate);

        await this.usersRepository.save(newUser);

        await this.emailService.sendEmailConfirmationMessage(
            newUser.email,
            confirmationCode,
        );
    }

    async resendRegistrationCode(email: string): Promise<void> {
        const foundUser =
            await this.usersRepository.findByLoginOrEmailNonDeleted(email);

        if (!foundUser) {
            throw BadRequestDomainException.create(
                'No user found for this email',
                'email',
            );
        }

        const confirmationCode = randomUUID();

        const expirationDate = add(new Date(), {
            hours: this.accountsConfig.confirmationCodeExpirationTimeInHours,
        });

        foundUser.setConfirmationCode(confirmationCode, expirationDate);

        await this.usersRepository.save(foundUser);

        await this.emailService.sendEmailConfirmationMessage(
            email,
            confirmationCode,
        );
    }
}
