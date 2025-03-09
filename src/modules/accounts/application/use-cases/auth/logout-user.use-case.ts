import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionContextDto } from '../../../guards/dto/session-context.dto';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { PostgresSessionsRepository } from '../../../infrastructure';

export class LogoutUserCommand {
    constructor(public session: SessionContextDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(
        private postgresSessionsRepository: PostgresSessionsRepository,
    ) {}

    async execute({ session }: LogoutUserCommand): Promise<void> {
        const foundSession =
            await this.postgresSessionsRepository.findByDeviceIdNonDeleted(
                session.deviceId,
            );

        if (!foundSession) {
            throw UnauthorizedDomainException.create(
                'PostgresSession not found for this device',
            );
        }

        if (foundSession.iat !== session.iat) {
            throw UnauthorizedDomainException.create('PostgresSession expired');
        }

        await this.postgresSessionsRepository.makeSessionDeletedById(
            foundSession.id,
        );

        // foundSession.makeDeleted();

        // await this.postgresSessionsRepository.save(foundSession);
    }
}
