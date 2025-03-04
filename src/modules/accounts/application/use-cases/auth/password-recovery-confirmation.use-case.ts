import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CryptoService } from '../../crypto.service';
import { UsersMongoRepository } from '../../../infrastructure';
import { UpdatePasswordDto } from '../../../dto/update';

export class PasswordRecoveryConfirmationCommand {
    constructor(public dto: UpdatePasswordDto) {}
}

@CommandHandler(PasswordRecoveryConfirmationCommand)
export class PasswordRecoveryConfirmationUseCase
    implements ICommandHandler<PasswordRecoveryConfirmationCommand, void>
{
    constructor(
        private usersMongoRepository: UsersMongoRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: PasswordRecoveryConfirmationCommand): Promise<void> {
        const foundUser =
            await this.usersMongoRepository.findUserByRecoveryCodeOrNotFoundFail(
                dto.recoveryCode,
            );

        const newPasswordHash = await this.cryptoService.createPasswordHash(
            dto.newPassword,
        );

        foundUser.changePassword(dto.recoveryCode, newPasswordHash);

        await this.usersMongoRepository.save(foundUser);
    }
}
