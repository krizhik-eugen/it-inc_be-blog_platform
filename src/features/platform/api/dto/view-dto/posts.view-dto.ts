import { ApiProperty } from '@nestjs/swagger';
import { PostDocument } from '../../../domain/post.entity';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { LikeStatus, NewestLikes } from '../../../types';

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
    @ApiProperty()
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatus;
        newestLikes: NewestLikes;
    };

    static mapToView(
        post: PostDocument,
        myStatus: LikeStatus,
        newestLikes: NewestLikes,
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
