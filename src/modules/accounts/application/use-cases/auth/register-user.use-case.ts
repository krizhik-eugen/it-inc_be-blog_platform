import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../../core/exceptions';
import { CreateUserCommand } from '../users';
import { AuthService } from '../../auth.service';
import {
    UsersPostgresRepository,
    UsersMongoRepository,
} from '../../../infrastructure';
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
        // private usersMongoRepository: UsersMongoRepository,
        private usersPostgresRepository: UsersPostgresRepository,
        private commandBus: CommandBus,
    ) {}

    async execute({ dto }: RegisterUserCommand): Promise<void> {
        const foundUserByLogin =
            await this.usersPostgresRepository.findByLoginOrEmail(dto.login);
        const foundUserByEmail =
            await this.usersPostgresRepository.findByLoginOrEmail(dto.email);

        if (foundUserByLogin || foundUserByEmail) {
            const fieldName = foundUserByLogin ? 'login' : 'email';
            let message = `MongoUser with this ${fieldName} already exists`;

            if (foundUserByLogin?.deleted_at || foundUserByEmail?.deleted_at) {
                message = `MongoUser with this ${fieldName} was in the system and has been deleted`;
            }

            throw BadRequestDomainException.create(message, fieldName);
        }

        const newUserId = await this.commandBus.execute<
            CreateUserCommand,
            number
        >(new CreateUserCommand(dto));

        const newUser =
            await this.usersPostgresRepository.findUserWithConfirmationStatus(
                newUserId,
            );

        if (newUser && !newUser.is_confirmed) {
            await this.authService.sendEmailConfirmationMessageToUser(newUser);
        }
    }
}
