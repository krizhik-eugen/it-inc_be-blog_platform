import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../../core/exceptions';
import { UsersMongoRepository } from '../../../infrastructure';

export class RegistrationConfirmationCommand {
    constructor(public dto: { code: string }) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
    implements ICommandHandler<RegistrationConfirmationCommand, void>
{
    constructor(private usersMongoRepository: UsersMongoRepository) {}
    async execute({ dto }: RegistrationConfirmationCommand): Promise<void> {
        const foundUser = await this.usersMongoRepository.findUserByConfirmationCode(
            dto.code,
        );

        if (!foundUser) {
            throw BadRequestDomainException.create(
                'No user found for this confirmation code',
                'code',
            );
        }

        foundUser.confirmUserEmail(dto.code);

        await this.usersMongoRepository.save(foundUser);
    }
}
