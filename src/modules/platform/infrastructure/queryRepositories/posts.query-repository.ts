import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from '../../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { Post, PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/dto/view-dto/posts.view-dto';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { LikeStatus } from '../../domain/like.entity';
import { LikesQueryRepository } from './likes.query-repository';

export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
        private likesQueryRepository: LikesQueryRepository,
    ) {}

    async getByIdOrNotFoundFail({
        postId,
        userId,
    }: {
        postId: string;
        userId: string | null;
    }): Promise<PostViewDto> {
        const post = await this.PostModel.findOne({
            _id: postId,
            deletedAt: null,
        }).exec();

        if (!post) {
            throw NotFoundDomainException.create('Post not found');
        }

        let likeStatus: LikeStatus = LikeStatus.None;

        if (userId) {
            likeStatus =
                await this.likesQueryRepository.getLikeStatusByUserIdAndParentId(
                    { parentId: postId, userId },
                );
        }

        const newestLikes =
            await this.likesQueryRepository.getLastThreeLikes(postId);

        return PostViewDto.mapToView(post, likeStatus, newestLikes);
    }

    async getAllPosts({
        query,
        userId,
    }: {
        query: GetPostsQueryParams;
        userId: string | null;
    }): Promise<PaginatedViewDto<PostViewDto[]>> {
        const findQuery: FilterQuery<Post> = { deletedAt: null };

        const result = await this.PostModel.find(findQuery)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);

        const postsCount = await this.PostModel.countDocuments(findQuery);
        const postsIds: string[] = [];

        const mappedPosts = result.map((post) => {
            postsIds.push(post._id.toString());
            return PostViewDto.mapToView(post, LikeStatus.None, []);
        });

        if (userId) {
            const likes = await this.likesQueryRepository.getLikesArray({
                parentIdsArray: postsIds,
                userId,
            });
            mappedPosts.forEach((post) => {
                const like = likes.find((like) => like.parentId === post.id);
                post.extendedLikesInfo.myStatus =
                    like?.status ?? LikeStatus.None;
            });
        }

        for (const post of mappedPosts) {
            post.extendedLikesInfo.newestLikes =
                await this.likesQueryRepository.getLastThreeLikes(post.id);
        }

        return PaginatedViewDto.mapToView({
            items: mappedPosts,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: postsCount,
        });
    }

    async getAllBlogPosts({
        query,
        blogId,
        userId,
    }: {
        query: GetPostsQueryParams;
        blogId: string;
        userId: string | null;
    }): Promise<PaginatedViewDto<PostViewDto[]>> {
        const blog = await this.BlogModel.findOne({
            _id: blogId,
            deletedAt: null,
        });

        if (!blog) {
            throw NotFoundDomainException.create('Blog not found');
        }

        const findQuery: FilterQuery<Post> = {
            blogId: blogId,
            deletedAt: null,
        };

        const result = await this.PostModel.find(findQuery)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);

        const postsCount = await this.PostModel.countDocuments(findQuery);
        const postsIds: string[] = [];

        const mappedPosts = result.map((post) => {
            postsIds.push(post._id.toString());
            return PostViewDto.mapToView(post, LikeStatus.None, []);
        });

        if (userId) {
            const likes = await this.likesQueryRepository.getLikesArray({
                parentIdsArray: postsIds,
                userId,
            });
            mappedPosts.forEach((post) => {
                const like = likes.find((like) => like.parentId === post.id);
                post.extendedLikesInfo.myStatus =
                    like?.status ?? LikeStatus.None;
            });
        }

        for (const post of mappedPosts) {
            post.extendedLikesInfo.newestLikes =
                await this.likesQueryRepository.getLastThreeLikes(post.id);
        }

        return PaginatedViewDto.mapToView({
            items: mappedPosts,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: postsCount,
        });
    }
}
