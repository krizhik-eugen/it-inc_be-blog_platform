import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';

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
    // @IsEnum(PostsSortBy)
    sortBy = PostsSortBy.CreatedAt;
}
