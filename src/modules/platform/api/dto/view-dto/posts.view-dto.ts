import { ApiProperty } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../../core/dto';
import { LikeStatus } from '../../../domain/like.entity';
import { ExtendedLikesInfo, LikeViewDto } from './likes.view-dto';
import { PostWithLikesCount } from '../../../domain/post.entity';

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
        post: PostWithLikesCount,
        myStatus: LikeStatus,
        newestLikes: LikeViewDto[],
    ): PostViewDto {
        const dto = new PostViewDto();

        dto.id = post.id.toString();
        dto.shortDescription = post.short_description;
        dto.title = post.title;
        dto.content = post.content;
        dto.createdAt = new Date(post.created_at).toISOString();
        dto.blogId = post.blog_id.toString();
        dto.blogName = post.blog_name;
        dto.extendedLikesInfo = {
            likesCount: post.likes_count,
            dislikesCount: post.dislikes_count,
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
