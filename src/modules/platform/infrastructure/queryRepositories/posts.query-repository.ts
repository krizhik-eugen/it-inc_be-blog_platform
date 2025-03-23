import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
    GetPostsQueryParams,
    PostsSortBy,
} from '../../api/dto/query-params-dto';
import {
    PaginatedPostgresPostsViewDto,
    PostgresPostViewDto,
} from '../../api/dto/view-dto';
import { LikeStatus } from '../../domain/like.entity';
import { LikesQueryRepository } from './likes.query-repository';
import { BlogsRepository } from '../repositories/blogs.repository';
import { PostsRepository } from '../repositories/posts.repository';
import { PostgresPost } from '../../domain/post.entity';

@Injectable()
export class PostgresPostsQueryRepository {
    constructor(
        private likesQueryRepository: LikesQueryRepository,
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
    }): Promise<PostgresPostViewDto> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);

        let likeStatus: LikeStatus = LikeStatus.None;

        if (userId) {
            likeStatus =
                await this.likesQueryRepository.getLikeStatusByUserIdAndParentId(
                    // TODO: fix types for postId
                    { parentId: postId.toString(), userId },
                );
        }

        const newestLikes = await this.likesQueryRepository.getLastThreeLikes(
            post.id.toString(),
        );

        return PostgresPostViewDto.mapToView(post, likeStatus, newestLikes);
    }

    async getAllPosts({
        query,
        blogId,
        userId,
    }: {
        query: GetPostsQueryParams;
        blogId: number | null;
        userId: number | null;
    }): Promise<PaginatedPostgresPostsViewDto> {
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
            (PostgresPost & { total_count: string })[]
        >(sqlQuery, queryParams);

        const totalCount = data.length ? parseInt(data[0].total_count) : 0;

        const postsIds: string[] = [];
        // TODO: fix types for id

        const mappedPosts = data.map((post) => {
            postsIds.push(post.id.toString());
            return PostgresPostViewDto.mapToView(post, LikeStatus.None, []);
        });

        if (userId) {
            const likes = await this.likesQueryRepository.getLikesArray({
                parentIdsArray: postsIds,
                userId,
            });
            mappedPosts.forEach((post) => {
                const like = likes.find(
                    (like) => like.parentId === post.id.toString(),
                );
                post.extendedLikesInfo.myStatus =
                    like?.status ?? LikeStatus.None;
            });
        }

        for (const post of mappedPosts) {
            post.extendedLikesInfo.newestLikes =
                await this.likesQueryRepository.getLastThreeLikes(post.id);
        }

        return PaginatedPostgresPostsViewDto.mapToView({
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
