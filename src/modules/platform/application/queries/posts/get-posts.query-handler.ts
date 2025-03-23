import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedPostgresPostsViewDto } from '../../../api/dto/view-dto';
import { PostgresPostsQueryRepository } from '../../../infrastructure';

export class GetPostsQuery {
    constructor(
        public query: GetPostsQueryParams,
        public userId: number | null,
    ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler
    implements IQueryHandler<GetPostsQuery, PaginatedPostgresPostsViewDto>
{
    constructor(
        private postgresPostsQueryRepository: PostgresPostsQueryRepository,
    ) {}

    async execute({
        query,
        userId,
    }: GetPostsQuery): Promise<PaginatedPostgresPostsViewDto> {
        return this.postgresPostsQueryRepository.getAllPosts({
            query,
            userId,
            blogId: null,
        });
    }
}
