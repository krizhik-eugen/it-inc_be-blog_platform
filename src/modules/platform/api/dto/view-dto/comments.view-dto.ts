import { ApiProperty } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../../core/dto';
import { LikesInfoViewDto } from './likes.view-dto';
import { CommentWithUserLogin } from '../../../domain/comment.entity';
import { LikeStatus } from '../../../domain/like.entity';

class CommentatorInfoViewDto {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    userLogin: string;
}

export class CommentViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    content: string;
    @ApiProperty({
        type: CommentatorInfoViewDto,
    })
    commentatorInfo: CommentatorInfoViewDto;
    @ApiProperty()
    createdAt: string;
    @ApiProperty({
        type: LikesInfoViewDto,
    })
    likesInfo: LikesInfoViewDto;

    static mapToView(
        comment: CommentWithUserLogin,
        myStatus: LikeStatus,
    ): CommentViewDto {
        const dto = new CommentViewDto();

        dto.id = comment.id.toString();
        dto.content = comment.content;
        dto.commentatorInfo = {
            userId: comment.user_id.toString(),
            userLogin: comment.user_login,
        };
        dto.createdAt = new Date(comment.created_at).toISOString();
        dto.likesInfo = {
            // likesCount: comment.likesCount,
            // dislikesCount: comment.dislikesCount,
            likesCount: 0,
            dislikesCount: 0,
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
