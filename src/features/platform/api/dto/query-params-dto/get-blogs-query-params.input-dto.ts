import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';

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
    sortBy = BlogsSortBy.CreatedAt;

    @ApiPropertyOptional({
        type: String,
        description:
            'Search term for blog Name: Name should contain this term in any position',
        default: null,
    })
    searchNameTerm: string | null = null;
}
