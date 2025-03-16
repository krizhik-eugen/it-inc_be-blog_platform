import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedCommentsViewDto } from '../../../api/dto/view-dto';
import { CommentsQueryRepository } from '../../../infrastructure';

export class GetCommentsQuery {
    constructor(
        public query: GetCommentsQueryParams,
        public postId: number,
        public userId: number | null,
    ) {}
}

@QueryHandler(GetCommentsQuery)
export class GetCommentsQueryHandler
    implements IQueryHandler<GetCommentsQuery, PaginatedCommentsViewDto>
{
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute({
        query,
        postId,
        userId,
    }: GetCommentsQuery): Promise<PaginatedCommentsViewDto> {
        return this.commentsQueryRepository.getAllPostComments({
            query,
            postId,
            userId,
        });
    }
}
