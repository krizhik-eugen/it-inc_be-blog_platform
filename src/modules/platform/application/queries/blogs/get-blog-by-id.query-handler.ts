import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogViewDto } from '../../../api/dto/view-dto';
import { BlogsQueryRepository } from '../../../infrastructure';

export class GetBlogByIdQuery {
    constructor(public blogId: number) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler
    implements IQueryHandler<GetBlogByIdQuery, BlogViewDto>
{
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute({ blogId }: GetBlogByIdQuery): Promise<BlogViewDto> {
        return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
    }
}
