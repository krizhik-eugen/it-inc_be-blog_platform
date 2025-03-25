import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostViewDto } from '../../../api/dto/view-dto';
import { PostgresPostsQueryRepository } from '../../../infrastructure';

export class GetPostByIdQuery {
    constructor(
        public postId: number,
        public userId: number | null,
    ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler
    implements IQueryHandler<GetPostByIdQuery, PostViewDto>
{
    constructor(
        private postgresPostsQueryRepository: PostgresPostsQueryRepository,
    ) {}

    async execute({ postId, userId }: GetPostByIdQuery): Promise<PostViewDto> {
        return this.postgresPostsQueryRepository.getByIdOrNotFoundFail({
            postId,
            userId,
        });
    }
}
