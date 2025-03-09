import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../auth.service';
import { UsersPostgresRepository } from '../../../infrastructure';

export class PasswordRecoveryCommand {
    constructor(public dto: { email: string }) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
    implements ICommandHandler<PasswordRecoveryCommand, void>
{
    constructor(
        private postgresUserRepository: UsersPostgresRepository,
        private authService: AuthService,
    ) {}

    async execute({ dto }: PasswordRecoveryCommand): Promise<void> {
        const foundUser = await this.postgresUserRepository.findByLoginOrEmail(
            dto.email,
        );
        if (foundUser) {
            await this.authService.sendEmailPasswordRecoveryMessageToUser(
                foundUser,
            );
        }
    }
}
