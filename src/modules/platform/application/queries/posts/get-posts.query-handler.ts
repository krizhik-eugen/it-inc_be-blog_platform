import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQueryParams } from '../../../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { PostsQueryRepository } from '../../../infrastructure/queryRepositories/posts.query-repository';
import { PaginatedPostsViewDto } from '../../../api/dto/view-dto/posts.view-dto';

export class GetPostsQuery {
    constructor(
        public query: GetPostsQueryParams,
        public userId: string | null,
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
