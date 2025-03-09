import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MongoSessionsRepository } from '../../../infrastructure/repositories/sessions.mongo-repository';
import { SessionContextDto } from '../../../guards/dto/session-context.dto';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class LogoutUserCommand {
    constructor(public session: SessionContextDto) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(private MongoSessionsRepository: MongoSessionsRepository) {}

    async execute({ session }: LogoutUserCommand): Promise<void> {
        const foundSession =
            await this.MongoSessionsRepository.findByDeviceIdNonDeleted(
                session.deviceId,
            );

        if (!foundSession) {
            throw UnauthorizedDomainException.create(
                'MongoSession not found for this device',
            );
        }

        if (foundSession.iat !== session.iat) {
            throw UnauthorizedDomainException.create('MongoSession expired');
        }

        foundSession.makeDeleted();

        await this.MongoSessionsRepository.save(foundSession);
    }
}
