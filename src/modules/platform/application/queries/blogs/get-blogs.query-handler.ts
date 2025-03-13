import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBlogsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedMongoBlogsViewDto } from '../../../api/dto/view-dto';
import { MongoBlogsQueryRepository } from '../../../infrastructure';

export class GetBlogsQuery {
    constructor(public query: GetBlogsQueryParams) {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler
    implements IQueryHandler<GetBlogsQuery, PaginatedMongoBlogsViewDto>
{
    constructor(private blogsQueryRepository: MongoBlogsQueryRepository) {}

    async execute({
        query,
    }: GetBlogsQuery): Promise<PaginatedMongoBlogsViewDto> {
        return this.blogsQueryRepository.getAllBlogs(query);
    }
}
