import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MongoMeViewDto } from '../../../api/dto/view-dto';
import { UsersMongoQueryRepository } from '../../../infrastructure';

export class GetCurrentUserQuery {
    constructor(public userId: string) {}
}

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserQueryHandler
    implements IQueryHandler<GetCurrentUserQuery, MongoMeViewDto>
{
    constructor(private usersMongoQueryRepository: UsersMongoQueryRepository) {}

    async execute({ userId }: GetCurrentUserQuery): Promise<MongoMeViewDto> {
        return this.usersMongoQueryRepository.getCurrentUserByIdOrNotFoundFail(
            userId,
        );
    }
}
