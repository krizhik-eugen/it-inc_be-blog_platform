import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostViewDto } from '../../../api/dto/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../../../infrastructure/queryRepositories/posts.query-repository';

export class GetPostByIdQuery {
    constructor(
        public postId: string,
        public userId: string | null,
    ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler
    implements IQueryHandler<GetPostByIdQuery, PostViewDto>
{
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    async execute({ postId, userId }: GetPostByIdQuery): Promise<PostViewDto> {
        return this.postsQueryRepository.getByIdOrNotFoundFail({
            postId,
            userId,
        });
    }
}
