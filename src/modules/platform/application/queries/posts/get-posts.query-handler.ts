import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedPostsViewDto } from '../../../api/dto/view-dto';
import { PostsQueryRepository } from '../../../infrastructure';

export class GetPostsQuery {
    constructor(
        public query: GetPostsQueryParams,
        public userId: number | null,
    ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler
    implements IQueryHandler<GetPostsQuery, PaginatedPostsViewDto>
{
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    async execute({
        query,
        userId,
    }: GetPostsQuery): Promise<PaginatedPostsViewDto> {
        return this.postsQueryRepository.getAllPosts({ query, userId });
    }
}
