import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../infrastructure';
import { SessionContextDto } from '../../../guards/dto/session-context.dto';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class DeleteSessionCommand {
    constructor(
        public deviceId: string,
        public session: SessionContextDto,
    ) {}
}
@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
    implements ICommandHandler<DeleteSessionCommand, void>
{
    constructor(private sessionsRepository: SessionsRepository) {}

    async execute({ deviceId, session }: DeleteSessionCommand): Promise<void> {
        const foundSession =
            await this.sessionsRepository.findByDeviceIdNonDeletedOrNotFoundFail(
                deviceId,
            );

        if (foundSession.userId !== session.userId) {
            throw ForbiddenDomainException.create(
                'You are not a owner of this session',
            );
        }

        foundSession.makeDeleted();

        await this.sessionsRepository.save(foundSession);
    }
}
