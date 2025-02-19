import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedUsersViewDto } from '../../../api/dto/view-dto';
import { GetUsersQueryParams } from '../../../api/dto/query-params-dto';
import { UsersQueryRepository } from '../../../infrastructure';

export class GetUsersQuery {
    constructor(public query: GetUsersQueryParams) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
    implements IQueryHandler<GetUsersQuery, PaginatedUsersViewDto>
{
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute({ query }: GetUsersQuery): Promise<PaginatedUsersViewDto> {
        return this.usersQueryRepository.getAllUsers(query);
    }
}
