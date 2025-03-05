import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedUsersViewDto } from '../../../api/dto/view-dto';
import { GetUsersQueryParams } from '../../../api/dto/query-params-dto';
import { UsersPostgresQueryRepository } from '../../../infrastructure';

export class GetUsersQuery {
    constructor(public query: GetUsersQueryParams) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
    implements IQueryHandler<GetUsersQuery, PaginatedUsersViewDto>
{
    constructor(
        // private usersMongoQueryRepository: UsersMongoQueryRepository,
        private usersPostgresQueryRepository: UsersPostgresQueryRepository,
    ) {}

    async execute({ query }: GetUsersQuery): Promise<PaginatedUsersViewDto> {
        return this.usersPostgresQueryRepository.getAllUsers(query);
        // return this.usersMongoQueryRepository.getAllUsers(query);
    }
}
