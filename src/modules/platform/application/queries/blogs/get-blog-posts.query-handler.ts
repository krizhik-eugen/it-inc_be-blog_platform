import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedPostsViewDto } from '../../../api/dto/view-dto';
import { PostsQueryRepository } from '../../../infrastructure';

export class GetBlogPostsQuery {
    constructor(
        public query: GetPostsQueryParams,
        public blogId: number,
        public userId: number | null,
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
            blogId: blogId.toString(), // TODO: remove toString()
            userId,
        });
    }
}
