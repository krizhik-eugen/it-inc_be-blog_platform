import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../../core/exceptions';
import { UsersMongoRepository } from '../../../infrastructure';
import { AuthService } from '../../auth.service';

export class RegistrationEmailResendingCommand {
    constructor(public dto: { email: string }) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
    implements ICommandHandler<RegistrationEmailResendingCommand, void>
{
    constructor(
        private usersMongoRepository: UsersMongoRepository,
        private authService: AuthService,
    ) {}
    async execute({ dto }: RegistrationEmailResendingCommand): Promise<void> {
        const foundUser =
            await this.usersMongoRepository.findByLoginOrEmailNonDeleted(dto.email);

        if (!foundUser) {
            throw BadRequestDomainException.create(
                'No user found for this email',
                'email',
            );
        }

        await this.authService.sendEmailConfirmationMessageToUser(foundUser);
    }
}
