import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../core/dto';

export enum CommentsSortBy {
    CreatedAt = 'createdAt',
}

export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentsSortBy> {
    @ApiPropertyOptional({
        type: String,
        example: CommentsSortBy.CreatedAt,
        default: CommentsSortBy.CreatedAt,
    })
    @IsEnum(CommentsSortBy)
    @IsOptional()
    sortBy = CommentsSortBy.CreatedAt;
}
