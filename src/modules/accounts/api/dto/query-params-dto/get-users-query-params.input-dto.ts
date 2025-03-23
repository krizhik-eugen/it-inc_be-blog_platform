import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../core/dto';

enum UsersSortBy {
    CreatedAt = 'createdAt',
    Login = 'login',
    Email = 'email',
}

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
    @ApiPropertyOptional({
        type: String,
        example: UsersSortBy.CreatedAt,
        default: UsersSortBy.CreatedAt,
    })
    @IsEnum(UsersSortBy)
    @IsOptional()
    sortBy = UsersSortBy.CreatedAt;

    @ApiPropertyOptional({
        type: String,
        description:
            'Search term for user Login: Login should contain this term in any position',
    })
    @IsString()
    @IsOptional()
    searchLoginTerm: string | null = null;

    @ApiPropertyOptional({
        type: String,
        description:
            'Search term for user Email: Email should contain this term in any position',
    })
    @IsString()
    @IsOptional()
    searchEmailTerm: string | null = null;
}
