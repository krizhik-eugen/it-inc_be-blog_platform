import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { AuthService } from '../auth.service';

export class RegistrationEmailResendingCommand {
    constructor(public dto: { email: string }) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
    implements ICommandHandler<RegistrationEmailResendingCommand, void>
{
    constructor(
        private usersRepository: UsersRepository,
        private authService: AuthService,
    ) {}
    async execute({ dto }: RegistrationEmailResendingCommand): Promise<void> {
        const foundUser =
            await this.usersRepository.findByLoginOrEmailNonDeleted(dto.email);

        if (!foundUser) {
            throw BadRequestDomainException.create(
                'No user found for this email',
                'email',
            );
        }

        await this.authService.sendEmailConfirmationMessageToUser(foundUser);
    }
}
