import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostgresMeViewDto, PostgresUserViewDto } from '../../../api/dto/view-dto';
import { UsersPostgresQueryRepository } from '../../../infrastructure';

export class GetCurrentUserQuery {
    constructor(public userId: number) {}
}

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserQueryHandler
    implements IQueryHandler<GetCurrentUserQuery, PostgresMeViewDto>
{
    constructor(
        private usersPostgresQueryRepository: UsersPostgresQueryRepository,
    ) {}

    async execute({
        userId,
    }: GetCurrentUserQuery): Promise<PostgresMeViewDto> {
        return this.usersPostgresQueryRepository.getCurrentUserByIdOrNotFoundFail(
            userId,
        );
    }
}
