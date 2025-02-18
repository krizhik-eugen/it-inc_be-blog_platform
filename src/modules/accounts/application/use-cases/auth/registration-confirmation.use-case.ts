import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure';
import { BadRequestDomainException } from '../../../../../core/exceptions';

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

        foundUser.confirmUserEmail(dto.code);

        await this.usersRepository.save(foundUser);
    }
}
