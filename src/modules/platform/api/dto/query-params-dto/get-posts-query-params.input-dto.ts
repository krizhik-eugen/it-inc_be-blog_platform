import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../core/dto';

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
    @IsEnum(PostsSortBy)
    sortBy = PostsSortBy.CreatedAt;
}
