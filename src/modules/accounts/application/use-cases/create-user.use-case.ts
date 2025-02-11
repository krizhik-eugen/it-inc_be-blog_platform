import bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SALT_ROUNDS } from '../../constants';
import { User, UserModelType } from '../../domain/user.entity';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { AccountsConfig } from '../../config/accounts.config';
import { CreateUserDto } from '../../dto/create/create-user.dto';

export class CreateUserCommand {
    constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
    implements ICommandHandler<CreateUserCommand, string>
{
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private accountsConfig: AccountsConfig,
    ) {}

    async execute({ dto }: CreateUserCommand): Promise<string> {
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordHash,
        });

        if (this.accountsConfig.isUserAutomaticallyConfirmed) {
            user.emailConfirmation.isConfirmed = true;
        }

        await this.usersRepository.save(user);

        return user._id.toString();
    }
}
