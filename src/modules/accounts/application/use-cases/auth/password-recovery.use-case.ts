import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../auth.service';
import { UsersRepository } from '../../../infrastructure';

export class PasswordRecoveryCommand {
    constructor(public dto: { email: string }) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
    implements ICommandHandler<PasswordRecoveryCommand, void>
{
    constructor(
        private userRepository: UsersRepository,
        private authService: AuthService,
    ) {}

    async execute({ dto }: PasswordRecoveryCommand): Promise<void> {
        const foundUser = await this.userRepository.findByLoginOrEmail(
            dto.email,
        );
        if (foundUser) {
            await this.authService.sendEmailPasswordRecoveryMessageToUser(
                foundUser,
            );
        }
    }
}
