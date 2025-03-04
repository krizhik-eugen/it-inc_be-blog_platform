import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../auth.service';
import { UsersMongoRepository } from '../../../infrastructure';

export class PasswordRecoveryCommand {
    constructor(public dto: { email: string }) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
    implements ICommandHandler<PasswordRecoveryCommand, void>
{
    constructor(
        private usersMongoRepository: UsersMongoRepository,
        private authService: AuthService,
    ) {}

    async execute({ dto }: PasswordRecoveryCommand): Promise<void> {
        const foundUser = await this.usersMongoRepository.findByLoginOrEmail(
            dto.email,
        );
        if (foundUser) {
            await this.authService.sendEmailPasswordRecoveryMessageToUser(
                foundUser,
            );
        }
    }
}
