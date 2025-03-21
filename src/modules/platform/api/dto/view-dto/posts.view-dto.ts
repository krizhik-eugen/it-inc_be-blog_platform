import { ApiProperty } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../../core/dto';
import { LikeStatus } from '../../../domain/like.entity';
import { ExtendedLikesInfo, LikeViewDto } from './likes.view-dto';
import { PostgresPost } from '../../../domain/post.postgres-entity';

// export class MongoPostViewDto {
//     @ApiProperty()
//     id: string;
//     @ApiProperty()
//     title: string;
//     @ApiProperty()
//     shortDescription: string;
//     @ApiProperty()
//     content: string;
//     @ApiProperty()
//     createdAt: string;
//     @ApiProperty()
//     blogId: number;
//     @ApiProperty()
//     blogName: string;
//     @ApiProperty({
//         type: ExtendedLikesInfo,
//     })
//     extendedLikesInfo: ExtendedLikesInfo;

//     static mapToView(
//         post: MongoPostDocument,
//         myStatus: LikeStatus,
//         newestLikes: LikeViewDto[],
//     ): MongoPostViewDto {
//         const dto = new MongoPostViewDto();

//         dto.id = post._id.toString();
//         dto.shortDescription = post.shortDescription;
//         dto.title = post.title;
//         dto.content = post.content;
//         dto.createdAt = post.createdAt;
//         dto.blogId = post.blogId;
//         dto.blogName = post.blogName;
//         dto.extendedLikesInfo = {
//             likesCount: post.likesCount,
//             dislikesCount: post.dislikesCount,
//             myStatus: myStatus,
//             newestLikes: newestLikes,
//         };

//         return dto;
//     }
// }

// export class PaginatedMongoPostsViewDto extends PaginatedViewDto<
//     MongoPostViewDto[]
// > {
//     @ApiProperty({
//         type: [MongoPostViewDto],
//     })
//     items: MongoPostViewDto[];
// }

export class PostgresPostViewDto {
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
        post: PostgresPost,
        myStatus: LikeStatus,
        newestLikes: LikeViewDto[],
    ): PostgresPostViewDto {
        const dto = new PostgresPostViewDto();

        dto.id = post.id.toString();
        dto.shortDescription = post.short_description;
        dto.title = post.title;
        dto.content = post.content;
        dto.createdAt = new Date(post.created_at).toISOString();
        dto.blogId = post.blog_id.toString();
        dto.blogName = post.blog_name;
        dto.extendedLikesInfo = {
            // TODO: implement likesCount and dislikesCount
            // likesCount: post.likesCount,
            // dislikesCount: post.dislikesCount,
            likesCount: 0,
            dislikesCount: 0,
            myStatus: myStatus,
            newestLikes: newestLikes,
        };

        return dto;
    }
}

export class PaginatedPostgresPostsViewDto extends PaginatedViewDto<
    PostgresPostViewDto[]
> {
    @ApiProperty({
        type: [PostgresPostViewDto],
    })
    items: PostgresPostViewDto[];
}
