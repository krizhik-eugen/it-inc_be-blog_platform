import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedUsersViewDto } from '../../../api/dto/view-dto/users.view-dto';
import { UsersQueryRepository } from '../../../infrastructure/queryRepositories/users.query-repository';
import { GetUsersQueryParams } from '../../../api/dto/query-params-dto/get-users-query-params.input-dto';

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
