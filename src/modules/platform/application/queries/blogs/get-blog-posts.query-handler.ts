import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedPostgresPostsViewDto } from '../../../api/dto/view-dto';
import { PostgresPostsQueryRepository } from '../../../infrastructure';

export class GetBlogPostsQuery {
    constructor(
        public query: GetPostsQueryParams,
        public blogId: number,
        public userId: number | null,
    ) {}
}

@QueryHandler(GetBlogPostsQuery)
export class GetBlogPostsQueryHandler
    implements IQueryHandler<GetBlogPostsQuery, PaginatedPostgresPostsViewDto>
{
    constructor(
        // private mongoPostsQueryRepository: MongoPostsQueryRepository,
        private postgresPostsQueryRepository: PostgresPostsQueryRepository,
    ) {}

    async execute({
        query,
        blogId,
        userId,
    }: GetBlogPostsQuery): Promise<PaginatedPostgresPostsViewDto> {
        return this.postgresPostsQueryRepository.getAllPosts({
            query,
            blogId,
            userId,
        });
    }
}
