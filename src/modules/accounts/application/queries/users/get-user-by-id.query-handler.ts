import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserViewDto } from '../../../api/dto/view-dto/users.view-dto';
import { UsersQueryRepository } from '../../../infrastructure/queryRepositories/users.query-repository';

export class GetUserByIdQuery {
    constructor(public userId: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
    implements IQueryHandler<GetUserByIdQuery, UserViewDto>
{
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute({ userId }: GetUserByIdQuery): Promise<UserViewDto> {
        return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
    }
}
