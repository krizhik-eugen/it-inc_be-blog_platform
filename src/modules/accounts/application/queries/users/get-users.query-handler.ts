import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedPostgresUsersViewDto } from '../../../api/dto/view-dto';
import { GetUsersQueryParams } from '../../../api/dto/query-params-dto';
import { UsersPostgresQueryRepository } from '../../../infrastructure';

export class GetUsersQuery {
    constructor(public query: GetUsersQueryParams) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
    implements IQueryHandler<GetUsersQuery, PaginatedPostgresUsersViewDto>
{
    constructor(
        private usersPostgresQueryRepository: UsersPostgresQueryRepository,
    ) {}

    async execute({
        query,
    }: GetUsersQuery): Promise<PaginatedPostgresUsersViewDto> {
        // return this.usersMongoQueryRepository.getAllUsers(query);
        return this.usersPostgresQueryRepository.getAllUsers(query);
    }
}
