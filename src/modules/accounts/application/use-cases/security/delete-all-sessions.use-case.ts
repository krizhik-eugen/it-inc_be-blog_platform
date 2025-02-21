import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../infrastructure';

export class DeleteAllSessionsCommand {
    constructor(
        public userId: string,
        public deviceId: string,
    ) {}
}
@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsUseCase
    implements ICommandHandler<DeleteAllSessionsCommand, void>
{
    constructor(private sessionsRepository: SessionsRepository) {}

    async execute({
        userId,
        deviceId,
    }: DeleteAllSessionsCommand): Promise<void> {
        await this.sessionsRepository.deleteAllSessionsExceptCurrent({
            userId,
            deviceId,
        });
    }
}
