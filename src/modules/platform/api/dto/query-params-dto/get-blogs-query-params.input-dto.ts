import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../core/dto';

enum BlogsSortBy {
    CreatedAt = 'createdAt',
    Name = 'name',
}

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
    @ApiPropertyOptional({
        type: String,
        example: BlogsSortBy.CreatedAt,
        default: BlogsSortBy.CreatedAt,
    })
    @IsEnum(BlogsSortBy)
    @IsOptional()
    sortBy = BlogsSortBy.CreatedAt;

    @ApiPropertyOptional({
        type: String,
        description:
            'Search term for blog Name: Name should contain this term in any position',
        default: null,
    })
    @IsString()
    @IsOptional()
    searchNameTerm: string | null = null;
}
