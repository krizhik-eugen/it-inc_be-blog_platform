import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountsConfig } from '../../../config';
import { CryptoService } from '../../crypto.service';
import { UsersRepository } from '../../../infrastructure';
import { CreateUserDto } from '../../../dto/create';
import { User, UserModelType } from '../../../domain/user.entity';

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
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: CreateUserCommand): Promise<string> {
        const passwordHash = await this.cryptoService.createPasswordHash(
            dto.password,
        );

        const newUser = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordHash,
        });

        if (this.accountsConfig.isUserAutomaticallyConfirmed) {
            newUser.emailConfirmation.isConfirmed = true;
        }

        await this.usersRepository.save(newUser);

        return newUser._id.toString();
    }
}
