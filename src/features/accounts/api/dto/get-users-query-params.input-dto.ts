import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../core/dto/base.query-params.input-dto';

enum UsersSortBy {
    CreatedAt = 'createdAt',
    Login = 'login',
    Email = 'email',
}

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
    @ApiPropertyOptional({
        type: String,
        example: UsersSortBy.CreatedAt,
    })
    sortBy = UsersSortBy.CreatedAt;

    @ApiPropertyOptional({
        type: String,
        description:
            'Search term for user Login: Login should contain this term in any position',
    })
    searchLoginTerm: string | null = null;

    @ApiPropertyOptional({
        type: String,
        description:
            'Search term for user Email: Email should contain this term in any position',
    })
    searchEmailTerm: string | null = null;
}
