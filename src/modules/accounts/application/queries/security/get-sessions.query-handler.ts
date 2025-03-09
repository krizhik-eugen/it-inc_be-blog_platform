import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostgresSessionsQueryRepository } from '../../../infrastructure';
import {
    MongoSessionViewDto,
    PostgresSessionViewDto,
} from '../../../api/dto/view-dto';

export class GetSessionsQuery {
    constructor(public userId: number) {}
}

@QueryHandler(GetSessionsQuery)
export class GetSessionsQueryHandler
    implements IQueryHandler<GetSessionsQuery, PostgresSessionViewDto[]>
{
    constructor(
        // private sessionsQueryRepository: MongoSessionsQueryRepository,
        private postgresSessionsQueryRepository: PostgresSessionsQueryRepository,
    ) {}

    async execute({
        userId,
    }: GetSessionsQuery): Promise<MongoSessionViewDto[]> {
        // return this.sessionsQueryRepository.getAllSessionsDevices(userId);
        return this.postgresSessionsQueryRepository.getAllSessionsDevices(
            userId,
        );
    }
}
