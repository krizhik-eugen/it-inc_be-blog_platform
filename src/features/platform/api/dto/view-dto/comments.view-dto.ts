import { ApiProperty } from '@nestjs/swagger';
import { CommentDocument } from '../../../domain/comment.entity';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { LikeStatus } from '../../../types';

export class CommentViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    content: string;
    @ApiProperty({
        type: 'object',
        properties: {
            userId: {
                type: 'string',
            },
            userLogin: {
                type: 'string',
            },
        },
    })
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    @ApiProperty()
    createdAt: string;
    @ApiProperty({
        type: 'object',
        properties: {
            likesCount: {
                type: 'number',
            },
            dislikesCount: {
                type: 'number',
            },
            myStatus: {
                type: 'string',
                default: LikeStatus.None,
            },
        },
    })
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatus;
    };

    static mapToView(
        comment: CommentDocument,
        myStatus: LikeStatus,
    ): CommentViewDto {
        const dto = new CommentViewDto();

        dto.id = comment._id.toString();
        dto.content = comment.content;
        dto.content = comment.content;
        dto.createdAt = comment.createdAt;
        dto.likesInfo = {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus: myStatus,
        };

        return dto;
    }
}

export class PaginatedCommentsViewDto extends PaginatedViewDto<
    CommentViewDto[]
> {
    @ApiProperty({
        type: [CommentViewDto],
    })
    items: CommentViewDto[];
}
