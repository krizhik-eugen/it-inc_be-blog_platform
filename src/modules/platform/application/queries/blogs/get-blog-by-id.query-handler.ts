import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostgresBlogViewDto } from '../../../api/dto/view-dto';
import { PostgresBlogsQueryRepository } from '../../../infrastructure';

export class GetBlogByIdQuery {
    constructor(public blogId: number) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler
    implements IQueryHandler<GetBlogByIdQuery, PostgresBlogViewDto>
{
    constructor(
        private postgresBlogsQueryRepository: PostgresBlogsQueryRepository,
    ) {}

    async execute({ blogId }: GetBlogByIdQuery): Promise<PostgresBlogViewDto> {
        return this.postgresBlogsQueryRepository.getByIdOrNotFoundFail(blogId);
    }
}
