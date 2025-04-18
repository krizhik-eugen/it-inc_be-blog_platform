import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountsConfig } from '../../../config';
import { CryptoService } from '../../crypto.service';
import { UsersRepository } from '../../../infrastructure';
import { CreateUserDto } from '../../../dto/create';

export class CreateUserCommand {
    constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
    implements ICommandHandler<CreateUserCommand, number>
{
    constructor(
        private usersRepository: UsersRepository,
        private accountsConfig: AccountsConfig,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: CreateUserCommand): Promise<number> {
        const passwordHash = await this.cryptoService.createPasswordHash(
            dto.password,
        );

        const newUserId = await this.usersRepository.addNewUser({
            login: dto.login,
            email: dto.email,
            passwordHash,
        });

        if (this.accountsConfig.isUserAutomaticallyConfirmed) {
            await this.usersRepository.updateUserIsConfirmed(newUserId, true);
        }

        return newUserId;
    }
}
