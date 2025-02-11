import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { CreateUserDto } from '../../dto/create/create-user.dto';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.use-case';
import { AuthService } from '../auth.service';

export class RegisterUserCommand {
    constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
    implements ICommandHandler<RegisterUserCommand, void>
{
    constructor(
        private authService: AuthService,
        private usersRepository: UsersRepository,
        private commandBus: CommandBus,
    ) {}

    async execute({ dto }: RegisterUserCommand): Promise<void> {
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

        const newUserId = await this.commandBus.execute<
            CreateUserCommand,
            string
        >(new CreateUserCommand(dto));

        const newUser =
            await this.usersRepository.findByIdOrNotFoundFail(newUserId);

        if (!newUser.emailConfirmation.isConfirmed) {
            await this.authService.sendEmailConfirmationMessageToUser(newUser);
        }
    }
}
