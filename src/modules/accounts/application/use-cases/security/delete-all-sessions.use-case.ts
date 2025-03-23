import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostgresSessionsRepository } from '../../../infrastructure';
import { SessionContextDto } from '../../../guards/dto/session-context.dto';

export class DeleteAllSessionsCommand {
    constructor(public session: SessionContextDto) {}
}
@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsUseCase
    implements ICommandHandler<DeleteAllSessionsCommand, void>
{
    constructor(
        private postgresSessionsRepository: PostgresSessionsRepository,
    ) {}

    async execute({ session }: DeleteAllSessionsCommand): Promise<void> {
        await this.postgresSessionsRepository.deleteAllSessionsExceptCurrent({
            userId: session.userId,
            deviceId: session.deviceId,
        });
    }
}
