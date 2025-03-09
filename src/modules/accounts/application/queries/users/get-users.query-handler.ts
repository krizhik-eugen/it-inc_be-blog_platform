import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedMongoUsersViewDto } from '../../../api/dto/view-dto';
import { GetUsersQueryParams } from '../../../api/dto/query-params-dto';
import { UsersPostgresQueryRepository } from '../../../infrastructure';

export class GetUsersQuery {
    constructor(public query: GetUsersQueryParams) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
    implements IQueryHandler<GetUsersQuery, PaginatedMongoUsersViewDto>
{
    constructor(
        // private usersMongoQueryRepository: UsersMongoQueryRepository,
        private usersPostgresQueryRepository: UsersPostgresQueryRepository,
    ) {}

    async execute({
        query,
    }: GetUsersQuery): Promise<PaginatedMongoUsersViewDto> {
        return this.usersPostgresQueryRepository.getAllUsers(query);
        // return this.usersMongoQueryRepository.getAllUsers(query);
    }
}
