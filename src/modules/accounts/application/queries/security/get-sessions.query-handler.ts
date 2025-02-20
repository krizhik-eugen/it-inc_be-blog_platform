import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionsQueryRepository } from '../../../infrastructure';
import { SessionViewDto } from '../../../api/dto/view-dto/sessions.view-dto';

export class GetSessionsQuery {
    constructor(public userId: string) {}
}

@QueryHandler(GetSessionsQuery)
export class GetSessionsQueryHandler
    implements IQueryHandler<GetSessionsQuery, SessionViewDto[]>
{
    constructor(private sessionsQueryRepository: SessionsQueryRepository) {}

    async execute({ userId }: GetSessionsQuery): Promise<SessionViewDto[]> {
        return this.sessionsQueryRepository.getAllSessionsDevices(userId);
    }
}
