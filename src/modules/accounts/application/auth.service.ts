import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { SuccessLoginViewDto } from '../api/dto/view-dto/success-login.view.dto';
import { CreateUserDto } from '../dto/create/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';
import { SALT_ROUNDS } from 'src/constants';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/modules/notifications/email.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) {}

    async validateUser(
        loginOrEmail: string,
        password: string,
    ): Promise<UserContextDto | null> {
        const user =
            await this.usersRepository.findByLoginOrEmailNonDeletedOrNotFoundFail(
                loginOrEmail,
            );

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

    async registerNewUser(dto: CreateUserDto) {
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

            throw new BadRequestException({
                message,
                field: fieldName,
            });
        }

        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

        const newUser = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordHash,
        });

        const confirmationCode = randomUUID();

        newUser.setConfirmationCode(confirmationCode);

        await this.usersRepository.save(newUser);

        await this.emailService.sendEmailConfirmationMessage(
            newUser.email,
            confirmationCode,
        );
    }

    async confirmUserEmail(code: string) {
        const foundUser =
            await this.usersRepository.findUserByConfirmationCodeOrNotFoundFail(
                code,
            );

        foundUser.confirmUserEmail(code);

        await this.usersRepository.save(foundUser);
    }

    async resendRegistrationCode(email: string) {
        const foundUser =
            await this.usersRepository.findByLoginOrEmailNonDeletedOrNotFoundFail(
                email,
            );

        const confirmationCode = randomUUID();

        foundUser.setConfirmationCode(confirmationCode);

        await this.usersRepository.save(foundUser);

        await this.emailService.sendEmailConfirmationMessage(
            email,
            confirmationCode,
        );
    }
}
