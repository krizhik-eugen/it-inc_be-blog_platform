import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';

enum CommentsSortBy {
    CreatedAt = 'createdAt',
}

export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentsSortBy> {
    @ApiPropertyOptional({
        type: String,
        example: CommentsSortBy.CreatedAt,
        default: CommentsSortBy.CreatedAt,
    })
    @IsEnum(CommentsSortBy)
    sortBy = CommentsSortBy.CreatedAt;
}
