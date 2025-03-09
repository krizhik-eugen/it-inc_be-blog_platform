import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostgresSessionsQueryRepository } from '../../../infrastructure';
import { PostgresSessionViewDto } from '../../../api/dto/view-dto';

export class GetSessionsQuery {
    constructor(public userId: number) {}
}

@QueryHandler(GetSessionsQuery)
export class GetSessionsQueryHandler
    implements IQueryHandler<GetSessionsQuery, PostgresSessionViewDto[]>
{
    constructor(
        private postgresSessionsQueryRepository: PostgresSessionsQueryRepository,
    ) {}

    async execute({
        userId,
    }: GetSessionsQuery): Promise<PostgresSessionViewDto[]> {
        // return this.sessionsQueryRepository.getAllSessionsDevices(userId);
        return this.postgresSessionsQueryRepository.getAllSessionsDevices(
            userId,
        );
    }
}
