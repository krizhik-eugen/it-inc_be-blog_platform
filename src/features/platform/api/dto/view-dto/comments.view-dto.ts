import { ApiProperty } from '@nestjs/swagger';
import { CommentDocument } from '../../../domain/comment.entity';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { LikeStatus } from '../../../types';

class LikesInfoViewDto {
    //TODO: move to likes
    @ApiProperty()
    likesCount: number;
    @ApiProperty()
    dislikesCount: number;
    @ApiProperty({ default: LikeStatus.None })
    myStatus: LikeStatus;
}

class CommentatorInfoViewDto {
    //TODO: define if we need to move somewhere else
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
