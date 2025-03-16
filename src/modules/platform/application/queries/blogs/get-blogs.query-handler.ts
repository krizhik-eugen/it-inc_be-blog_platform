import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBlogsQueryParams } from '../../../api/dto/query-params-dto';
import { PaginatedPostgresBlogsViewDto } from '../../../api/dto/view-dto';
import { PostgresBlogsQueryRepository } from '../../../infrastructure';

export class GetBlogsQuery {
    constructor(public query: GetBlogsQueryParams) {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler
    implements IQueryHandler<GetBlogsQuery, PaginatedPostgresBlogsViewDto>
{
    constructor(
        // private blogsMongoQueryRepository: MongoBlogsQueryRepository,
        private postgresBlogsQueryRepository: PostgresBlogsQueryRepository,
    ) {}

    async execute({
        query,
    }: GetBlogsQuery): Promise<PaginatedPostgresBlogsViewDto> {
        return this.postgresBlogsQueryRepository.getAllBlogs(query);
    }
}
