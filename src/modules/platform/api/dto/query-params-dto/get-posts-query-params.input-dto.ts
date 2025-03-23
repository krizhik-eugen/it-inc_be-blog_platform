import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../core/dto';

export enum PostsSortBy {
    CreatedAt = 'createdAt',
    Title = 'title',
    BlogName = 'blogName',
}

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
    @ApiPropertyOptional({
        type: String,
        example: PostsSortBy.CreatedAt,
        default: PostsSortBy.CreatedAt,
    })
    // @IsEnum(PostsSortBy)
    @IsOptional()
    sortBy = PostsSortBy.CreatedAt;
}
