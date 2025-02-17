import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentsQueryParams } from '../../../api/dto/query-params-dto/get-comments-query-params.input-dto';
import { CommentsQueryRepository } from '../../../infrastructure/queryRepositories/comments.query-repository';
import { PaginatedCommentsViewDto } from '../../../api/dto/view-dto/comments.view-dto';

export class GetCommentsQuery {
    constructor(
        public query: GetCommentsQueryParams,
        public postId: string,
        public userId: string | null,
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
