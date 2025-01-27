import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';

enum PostsSortBy {
    CreatedAt = 'createdAt',
    Title = 'title',
}

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
    @ApiPropertyOptional({
        type: String,
        example: PostsSortBy.CreatedAt,
        default: PostsSortBy.CreatedAt,
    })
    sortBy = PostsSortBy.CreatedAt;
}
