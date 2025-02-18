import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure';
import { AuthService } from '../../auth.service';

export class PasswordRecoveryCommand {
    constructor(public dto: { email: string }) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
    implements ICommandHandler<PasswordRecoveryCommand, void>
{
    constructor(
        private usersRepository: UsersRepository,
        private authService: AuthService,
    ) {}

    async execute({ dto }: PasswordRecoveryCommand): Promise<void> {
        const foundUser = await this.usersRepository.findByLoginOrEmail(
            dto.email,
        );
        if (foundUser) {
            await this.authService.sendEmailPasswordRecoveryMessageToUser(
                foundUser,
            );
        }
    }
}
