import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogViewDto } from '../../../api/dto/view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../../../infrastructure/queryRepositories/blogs.query-repository';

export class GetBlogByIdQuery {
    constructor(public blogId: string) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler
    implements IQueryHandler<GetBlogByIdQuery, BlogViewDto>
{
    constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

    async execute({ blogId }: GetBlogByIdQuery): Promise<BlogViewDto> {
        return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
    }
}
