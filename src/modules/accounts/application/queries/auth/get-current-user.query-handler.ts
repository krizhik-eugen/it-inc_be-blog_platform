import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MeViewDto } from '../../../api/dto/view-dto';
import { UsersQueryRepository } from '../../../infrastructure';

export class GetCurrentUserQuery {
    constructor(public userId: number) {}
}

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserQueryHandler
    implements IQueryHandler<GetCurrentUserQuery, MeViewDto>
{
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute({ userId }: GetCurrentUserQuery): Promise<MeViewDto> {
        return this.usersQueryRepository.getCurrentUserByIdOrNotFoundFail(
            userId,
        );
    }
}
