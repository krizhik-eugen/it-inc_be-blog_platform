import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentViewDto } from '../../../api/dto/view-dto';
import { CommentsQueryRepository } from '../../../infrastructure';

export class GetCommentByIdQuery {
    constructor(
        public commentId: string,
        public userId: string | null,
    ) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler
    implements IQueryHandler<GetCommentByIdQuery, CommentViewDto>
{
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute({
        commentId,
        userId,
    }: GetCommentByIdQuery): Promise<CommentViewDto> {
        return this.commentsQueryRepository.getByIdOrNotFoundFail({
            commentId,
            userId,
        });
    }
}
