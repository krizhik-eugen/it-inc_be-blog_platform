import { ApiProperty } from '@nestjs/swagger';
import { PostDocument } from '../../../domain/post.entity';
import { PaginatedViewDto } from '../../../../../core/dto';
import { ExtendedLikesInfo, LikeViewDto } from './likes.view-dto';
import { LikeStatus } from '../../../domain/like.entity';

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
