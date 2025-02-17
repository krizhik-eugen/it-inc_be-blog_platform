import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQueryParams } from '../../../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { PostsQueryRepository } from '../../../infrastructure/queryRepositories/posts.query-repository';
import { PaginatedPostsViewDto } from '../../../api/dto/view-dto/posts.view-dto';

export class GetBlogPostsQuery {
    constructor(
        public query: GetPostsQueryParams,
        public blogId: string,
        public userId: string | null,
    ) {}
}

@QueryHandler(GetBlogPostsQuery)
export class GetBlogPostsQueryHandler
    implements IQueryHandler<GetBlogPostsQuery, PaginatedPostsViewDto>
{
    constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

    async execute({
        query,
        blogId,
        userId,
    }: GetBlogPostsQuery): Promise<PaginatedPostsViewDto> {
        return this.postsQueryRepository.getAllBlogPosts({
            query,
            blogId,
            userId,
        });
    }
}
