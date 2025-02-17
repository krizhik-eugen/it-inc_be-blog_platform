import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentViewDto } from '../../../api/dto/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../../infrastructure/queryRepositories/comments.query-repository';

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
