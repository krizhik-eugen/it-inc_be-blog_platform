import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostgresUserViewDto } from '../../../api/dto/view-dto';
import { UsersPostgresQueryRepository } from '../../../infrastructure';

export class GetUserByIdQuery {
    constructor(public userId: number) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
    implements IQueryHandler<GetUserByIdQuery, PostgresUserViewDto>
{
    constructor(
        private usersPostgresQueryRepository: UsersPostgresQueryRepository,
    ) {}

    async execute({ userId }: GetUserByIdQuery): Promise<PostgresUserViewDto> {
        // return this.usersMongoQueryRepository.getByIdOrNotFoundFail(userId);
        return this.usersPostgresQueryRepository.getByIdOrNotFoundFail(userId);
    }
}
