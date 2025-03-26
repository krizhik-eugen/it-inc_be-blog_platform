import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../../core/exceptions';
import { UsersRepository } from '../../../infrastructure';

export class RegistrationConfirmationCommand {
    constructor(public dto: { code: string }) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
    implements ICommandHandler<RegistrationConfirmationCommand, void>
{
    constructor(private usersRepository: UsersRepository) {}
    async execute({ dto }: RegistrationConfirmationCommand): Promise<void> {
        const foundUser = await this.usersRepository.findUserByConfirmationCode(
            dto.code,
        );

        if (!foundUser) {
            throw BadRequestDomainException.create(
                'No user found for this confirmation code',
                'code',
            );
        }

        if (foundUser.is_confirmed) {
            throw BadRequestDomainException.create(
                'The user has already been confirmed',
                'code',
            );
        }

        if (foundUser.confirmation_code !== dto.code) {
            throw BadRequestDomainException.create('Invalid code', 'code');
        }

        if (!foundUser.expiration_date) {
            throw new Error(
                'Expiration date for email confirmation is not set',
            );
        }

        if (new Date() > foundUser.expiration_date) {
            throw BadRequestDomainException.create('Code expired', 'code');
        }

        await this.usersRepository.updateUserIsConfirmed(foundUser.id, true);
    }
}
