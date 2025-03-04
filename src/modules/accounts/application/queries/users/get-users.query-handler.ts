import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedUsersViewDto } from '../../../api/dto/view-dto';
import { GetUsersQueryParams } from '../../../api/dto/query-params-dto';
import { UsersMongoQueryRepository } from '../../../infrastructure';

export class GetUsersQuery {
    constructor(public query: GetUsersQueryParams) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
    implements IQueryHandler<GetUsersQuery, PaginatedUsersViewDto>
{
    constructor(private usersMongoQueryRepository: UsersMongoQueryRepository) {}

    async execute({ query }: GetUsersQuery): Promise<PaginatedUsersViewDto> {
        return this.usersMongoQueryRepository.getAllUsers(query);
    }
}
