import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserViewDto } from '../../../api/dto/view-dto';
import { UsersMongoQueryRepository } from '../../../infrastructure';

export class GetUserByIdQuery {
    constructor(public userId: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
    implements IQueryHandler<GetUserByIdQuery, UserViewDto>
{
    constructor(private usersMongoQueryRepository: UsersMongoQueryRepository) {}

    async execute({ userId }: GetUserByIdQuery): Promise<UserViewDto> {
        return this.usersMongoQueryRepository.getByIdOrNotFoundFail(userId);
    }
}
