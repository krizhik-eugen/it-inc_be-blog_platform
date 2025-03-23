import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostgresPostViewDto } from '../../../api/dto/view-dto';
import { PostgresPostsQueryRepository } from '../../../infrastructure';

export class GetPostByIdQuery {
    constructor(
        public postId: number,
        public userId: number | null,
    ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler
    implements IQueryHandler<GetPostByIdQuery, PostgresPostViewDto>
{
    constructor(
        private postgresPostsQueryRepository: PostgresPostsQueryRepository,
    ) {}

    async execute({
        postId,
        userId,
    }: GetPostByIdQuery): Promise<PostgresPostViewDto> {
        return this.postgresPostsQueryRepository.getByIdOrNotFoundFail({
            postId,
            userId,
        });
    }
}
