import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../infrastructure/repositories/sessions.repository';
import { SessionContextDto } from '../../../guards/dto/session-context.dto';

export class LogoutUserCommand {
    constructor(public session: SessionContextDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(private sessionsRepository: SessionsRepository) {}

    async execute({ session }: LogoutUserCommand): Promise<void> {
        await this.sessionsRepository.findByDeviceIdNonDeletedOrNotFoundFail(
            session.deviceId,
        );
    }
}
