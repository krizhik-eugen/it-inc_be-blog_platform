import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CryptoService } from '../../crypto.service';
import { UsersRepository } from '../../../infrastructure';
import { UpdatePasswordDto } from '../../../dto/update';

export class PasswordRecoveryConfirmationCommand {
    constructor(public dto: UpdatePasswordDto) {}
}

@CommandHandler(PasswordRecoveryConfirmationCommand)
export class PasswordRecoveryConfirmationUseCase
    implements ICommandHandler<PasswordRecoveryConfirmationCommand, void>
{
    constructor(
        private usersPostgresRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: PasswordRecoveryConfirmationCommand): Promise<void> {
        const foundUser =
            await this.usersPostgresRepository.findUserByRecoveryCodeOrNotFoundFail(
                dto.recoveryCode,
            );

        const newPasswordHash = await this.cryptoService.createPasswordHash(
            dto.newPassword,
        );

        await this.usersPostgresRepository.changeUserPasswordById(
            foundUser.id,
            newPasswordHash,
        );
    }
}
