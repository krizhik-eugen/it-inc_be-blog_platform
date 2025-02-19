import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../../core/exceptions';
import { CreateUserCommand } from '../users';
import { AuthService } from '../../auth.service';
import { UsersRepository } from '../../../infrastructure';
import { CreateUserDto } from '../../../dto/create';

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
