import { ApiProperty } from '@nestjs/swagger';
import { PostDocument } from '../../../domain/post.entity';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { LikeStatus } from '../../../types';

class LikeViewDto {
    //TODO: move to likes
    @ApiProperty()
    addedAt: string;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    login: string;
}

class ExtendedLikesInfo {
    @ApiProperty()
    likesCount: number;
    @ApiProperty()
    dislikesCount: number;
    @ApiProperty({ default: LikeStatus.None })
    myStatus: LikeStatus;
    @ApiProperty({
        type: [LikeViewDto],
    })
    newestLikes: LikeViewDto[];
}
export class PostViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    shortDescription: string;
    @ApiProperty()
    content: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty()
    blogId: string;
    @ApiProperty()
    blogName: string;
    @ApiProperty({
        type: ExtendedLikesInfo,
    })
    extendedLikesInfo: ExtendedLikesInfo;

    static mapToView(
        post: PostDocument,
        myStatus: LikeStatus,
        newestLikes: LikeViewDto[],
    ): PostViewDto {
        const dto = new PostViewDto();

        dto.id = post._id.toString();
        dto.shortDescription = post.shortDescription;
        dto.title = post.title;
        dto.content = post.content;
        dto.createdAt = post.createdAt;
        dto.blogId = post.blogId;
        dto.blogName = post.blogName;
        dto.extendedLikesInfo = {
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
            myStatus: myStatus,
            newestLikes: newestLikes,
        };

        return dto;
    }
}

export class PaginatedPostsViewDto extends PaginatedViewDto<PostViewDto[]> {
    @ApiProperty({
        type: [PostViewDto],
    })
    items: PostViewDto[];
}
