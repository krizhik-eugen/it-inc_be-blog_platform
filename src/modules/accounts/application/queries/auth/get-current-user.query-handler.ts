import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MeViewDto } from '../../../api/dto/view-dto';
import { UsersMongoQueryRepository } from '../../../infrastructure';

export class GetCurrentUserQuery {
    constructor(public userId: string) {}
}

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserQueryHandler
    implements IQueryHandler<GetCurrentUserQuery, MeViewDto>
{
    constructor(private usersMongoQueryRepository: UsersMongoQueryRepository) {}

    async execute({ userId }: GetCurrentUserQuery): Promise<MeViewDto> {
        return this.usersMongoQueryRepository.getCurrentUserByIdOrNotFoundFail(
            userId,
        );
    }
}
