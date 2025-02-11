import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../constants';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { UpdatePasswordDto } from '../../dto/update/update-password.dto';

export class PasswordRecoveryConfirmationCommand {
    constructor(public dto: UpdatePasswordDto) {}
}

@CommandHandler(PasswordRecoveryConfirmationCommand)
export class PasswordRecoveryConfirmationUseCase
    implements ICommandHandler<PasswordRecoveryConfirmationCommand, void>
{
    constructor(private usersRepository: UsersRepository) {}

    async execute({ dto }: PasswordRecoveryConfirmationCommand): Promise<void> {
        const foundUser =
            await this.usersRepository.findUserByRecoveryCodeOrNotFoundFail(
                dto.recoveryCode,
            );

        const newPasswordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);

        foundUser.changePassword(dto.recoveryCode, newPasswordHash);

        await this.usersRepository.save(foundUser);
    }
}
