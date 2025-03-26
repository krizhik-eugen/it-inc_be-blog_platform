import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBlogsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedBlogsViewDto } from '../../../api/dto/view-dto';
import { BlogsQueryRepository } from '../../../infrastructure';

export class GetBlogsQuery {
    constructor(public query: GetBlogsQueryParams) {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler
    implements IQueryHandler<GetBlogsQuery, PaginatedBlogsViewDto>
{
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute({ query }: GetBlogsQuery): Promise<PaginatedBlogsViewDto> {
        return this.blogsQueryRepository.getAllBlogs(query);
    }
}
