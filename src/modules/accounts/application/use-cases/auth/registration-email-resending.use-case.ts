import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../../core/exceptions';
import { UsersRepository } from '../../../infrastructure';
import { AuthService } from '../../auth.service';

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
            await this.usersRepository.findByEmailWithConfirmationStatusNonDeleted(
                dto.email,
            );

        if (!foundUser) {
            throw BadRequestDomainException.create(
                'No user found for this email',
                'email',
            );
        }

        if (foundUser.is_confirmed) {
            throw BadRequestDomainException.create(
                'Email is already confirmed',
                'email',
            );
        }

        await this.authService.sendEmailConfirmationMessageToUser(foundUser);
    }
}
