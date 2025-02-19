import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedPostsViewDto } from '../../../api/dto/view-dto';
import { PostsQueryRepository } from '../../../infrastructure';

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
    constructor(private postsQueryRepository: PostsQueryRepository) {}

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
