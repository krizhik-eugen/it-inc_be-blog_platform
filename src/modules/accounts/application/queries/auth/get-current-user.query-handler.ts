import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostgresUserViewDto } from '../../../api/dto/view-dto';
import { UsersPostgresQueryRepository } from '../../../infrastructure';

export class GetCurrentUserQuery {
    constructor(public userId: number) {}
}

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserQueryHandler
    implements IQueryHandler<GetCurrentUserQuery, PostgresUserViewDto>
{
    constructor(
        // private usersMongoQueryRepository: UsersMongoQueryRepository,
        private usersPostgresQueryRepository: UsersPostgresQueryRepository,
    ) {}

    async execute({
        userId,
    }: GetCurrentUserQuery): Promise<PostgresUserViewDto> {
        return this.usersPostgresQueryRepository.getCurrentUserByIdOrNotFoundFail(
            userId,
        );
    }
}
