import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../infrastructure/repositories/sessions.repository';
import { SessionContextDto } from '../../../guards/dto/session-context.dto';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class LogoutUserCommand {
    constructor(public session: SessionContextDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(private sessionsRepository: SessionsRepository) {}

    async execute({ session }: LogoutUserCommand): Promise<void> {
        const foundSession =
            await this.sessionsRepository.findByDeviceIdNonDeleted(
                session.deviceId,
            );

        if (!foundSession) {
            throw UnauthorizedDomainException.create('Session not found');
        }

        if (foundSession.iat !== session.iat) {
            throw UnauthorizedDomainException.create('Session expired');
        }

        foundSession.makeDeleted();

        await this.sessionsRepository.save(foundSession);
    }
}
