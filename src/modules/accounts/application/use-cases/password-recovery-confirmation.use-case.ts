import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { UpdatePasswordDto } from '../../dto/update/update-password.dto';
import { CryptoService } from '../crypto.service';

export class PasswordRecoveryConfirmationCommand {
    constructor(public dto: UpdatePasswordDto) {}
}

@CommandHandler(PasswordRecoveryConfirmationCommand)
export class PasswordRecoveryConfirmationUseCase
    implements ICommandHandler<PasswordRecoveryConfirmationCommand, void>
{
    constructor(
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: PasswordRecoveryConfirmationCommand): Promise<void> {
        const foundUser =
            await this.usersRepository.findUserByRecoveryCodeOrNotFoundFail(
                dto.recoveryCode,
            );

        const newPasswordHash = await this.cryptoService.createPasswordHash(
            dto.newPassword,
        );

        foundUser.changePassword(dto.recoveryCode, newPasswordHash);

        await this.usersRepository.save(foundUser);
    }
}
