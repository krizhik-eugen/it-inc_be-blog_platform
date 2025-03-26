import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
    GetPostsQueryParams,
    PostsSortBy,
} from '../../api/dto/query-params-dto';
import { PaginatedPostsViewDto, PostViewDto } from '../../api/dto/view-dto';
import { LikeParentType, LikeStatus } from '../../domain/like.entity';
import { LikesQueryRepository } from './likes.query-repository';
import { BlogsRepository } from '../repositories/blogs.repository';
import { PostsRepository } from '../repositories/posts.repository';
import { Post, PostWithLikesCount } from '../../domain/post.entity';
import { LikesRepository } from '../repositories/likes.repository';

@Injectable()
export class PostsQueryRepository {
    constructor(
        private likesQueryRepository: LikesQueryRepository,
        private likesRepository: LikesRepository,
        private blogsRepository: BlogsRepository,
        private postsRepository: PostsRepository,
        private dataSource: DataSource,
    ) {}

    async getByIdOrNotFoundFail({
        postId,
        userId,
    }: {
        postId: number;
        userId: number | null;
    }): Promise<PostViewDto> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);

        let likeStatus: LikeStatus = LikeStatus.None;
        const postWithLikes: PostWithLikesCount = {
            ...post,
            likes_count: 0,
            dislikes_count: 0,
        };

        if (userId) {
            likeStatus =
                await this.likesRepository.getLikeStatusByUserIdAndParentIdAndType(
                    {
                        parentId: postId,
                        userId,
                        parentType: LikeParentType.Post,
                    },
                );
        }

        const { likesCount, dislikesCount } =
            await this.likesRepository.getLikesAndDislikesCountByParentId(
                postId,
                LikeParentType.Post,
            );
        postWithLikes.likes_count = likesCount;
        postWithLikes.dislikes_count = dislikesCount;

        const newestLikes = await this.likesQueryRepository.getLastThreeLikes(
            postId,
            LikeParentType.Post,
        );

        return PostViewDto.mapToView(postWithLikes, likeStatus, newestLikes);
    }

    async getAllPosts({
        query,
        blogId,
        userId,
    }: {
        query: GetPostsQueryParams;
        blogId: number | null;
        userId: number | null;
    }): Promise<PaginatedPostsViewDto> {
        if (blogId) {
            await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(blogId);
        }

        const queryParams: (string | number)[] = [];
        let paramIndex = 1;

        let filterCondition = `deleted_at IS NULL`;

        if (blogId) {
            filterCondition += ` AND blog_id = $${paramIndex}`;
            queryParams.push(blogId);
            paramIndex++;
        }

        const sqlQuery = `
            SELECT p.*, COUNT(*) OVER() as total_count
            FROM public.posts p
            WHERE ${filterCondition}
            ORDER BY ${this.sanitizeSortField(query.sortBy)} ${query.sortDirection}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        queryParams.push(query.pageSize, query.calculateSkip());

        const data = await this.dataSource.query<
            (Post & { total_count: string })[]
        >(sqlQuery, queryParams);

        const totalCount = data.length ? parseInt(data[0].total_count) : 0;

        const postsIds: number[] = [];

        const mappedPosts = data.map((post) => {
            const postWithLikes: PostWithLikesCount = {
                ...post,
                likes_count: 0,
                dislikes_count: 0,
            };
            postsIds.push(post.id);
            return PostViewDto.mapToView(postWithLikes, LikeStatus.None, []);
        });

        if (userId) {
            const likes = await this.likesRepository.getLikesArray({
                parentIdsArray: postsIds,
                userId,
                parentType: LikeParentType.Post,
            });
            mappedPosts.forEach((post) => {
                const like = likes.find(
                    (like) => like.parent_id === parseInt(post.id),
                );
                post.extendedLikesInfo.myStatus =
                    like?.status ?? LikeStatus.None;
            });
        }

        for (const post of mappedPosts) {
            post.extendedLikesInfo.newestLikes =
                await this.likesQueryRepository.getLastThreeLikes(
                    parseInt(post.id),
                    LikeParentType.Post,
                );
        }

        return PaginatedPostsViewDto.mapToView({
            items: mappedPosts,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: totalCount,
        });
    }

    private sanitizeSortField(
        field: PostsSortBy,
    ): 'title' | 'created_at' | 'blog_name' {
        switch (field) {
            case PostsSortBy.Title:
                return 'title';
            case PostsSortBy.CreatedAt:
                return 'created_at';
            case PostsSortBy.BlogName:
                return 'blog_name';
            default:
                return 'created_at';
        }
    }
}
