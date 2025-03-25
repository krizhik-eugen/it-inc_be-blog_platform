import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { LikeParentType, LikeStatus } from '../../domain/like.entity';
import { PostsRepository } from '../repositories/posts.repository';
import {
    CommentViewDto,
    PaginatedCommentsViewDto,
} from '../../api/dto/view-dto/comments.view-dto';
import { CommentWithUserLogin } from '../../domain/comment.entity';
import {
    CommentsSortBy,
    GetCommentsQueryParams,
} from '../../api/dto/query-params-dto';
import { LikesRepository } from '../repositories/likes.repository';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        private dataSource: DataSource,
        private likesRepository: LikesRepository,
        private postsRepository: PostsRepository,
    ) {}

    async getByIdOrNotFoundFail({
        commentId,
        userId,
    }: {
        commentId: number;
        userId: number | null;
    }): Promise<CommentViewDto> {
        const data: CommentWithUserLogin[] = await this.dataSource.query(
            `
                SELECT c.* , u.login AS user_login FROM public.comments c 
                JOIN public.users u ON c.user_id = u.id
                WHERE c.id = $1 AND c.deleted_at IS NULL 
                `,
            [commentId],
        );

        if (!data[0]) {
            throw NotFoundDomainException.create('Comment is not found');
        }

        let likeStatus: LikeStatus = LikeStatus.None;
        const commentWithLikesCount = {
            ...data[0],
            likes_count: 0,
            dislikes_count: 0,
        };

        if (userId) {
            likeStatus =
                await this.likesRepository.getLikeStatusByUserIdAndParentIdAndType(
                    {
                        parentId: commentId,
                        userId,
                        parentType: LikeParentType.Comment,
                    },
                );
        }

        const { likesCount, dislikesCount } =
            await this.likesRepository.getLikesAndDislikesCountByParentId(
                commentId,
                LikeParentType.Comment,
            );
        commentWithLikesCount.likes_count = likesCount;
        commentWithLikesCount.dislikes_count = dislikesCount;

        return CommentViewDto.mapToView(commentWithLikesCount, likeStatus);
    }

    async getAllPostComments({
        query,
        postId,
        userId,
    }: {
        query: GetCommentsQueryParams;
        postId: number;
        userId: number | null;
    }): Promise<PaginatedCommentsViewDto> {
        await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);

        const sqlQuery = `
            SELECT c.*, u.login AS user_login, COUNT(*) OVER() as total_count 
            FROM public.comments c JOIN public.users u ON c.user_id = u.id
            WHERE c.post_id = $1 AND c.deleted_at IS NULL
            ORDER BY ${this.sanitizeSortField(query.sortBy)} ${query.sortDirection}
            LIMIT $2 OFFSET $3
        `;

        const queryParams: (string | number)[] = [
            postId,
            query.pageSize,
            query.calculateSkip(),
        ];

        const data = await this.dataSource.query<
            (CommentWithUserLogin & { total_count: string })[]
        >(sqlQuery, queryParams);

        const totalCount = data.length ? parseInt(data[0].total_count) : 0;

        const commentsIds = data.map((comment) => comment.id);
        const mappedComments = data.map((comment) => {
            const commentWithLikesCount = {
                ...comment,
                likes_count: 0,
                dislikes_count: 0,
            };
            return CommentViewDto.mapToView(
                commentWithLikesCount,
                LikeStatus.None,
            );
        });

        if (userId && commentsIds.length > 0) {
            const likes = await this.likesRepository.getLikesArray({
                parentIdsArray: commentsIds,
                userId,
                parentType: LikeParentType.Comment,
            });

            mappedComments.forEach((comment) => {
                const like = likes.find(
                    (like) => like.parent_id === parseInt(comment.id),
                );
                comment.likesInfo.myStatus = like?.status ?? LikeStatus.None;
            });
        }

        return PaginatedCommentsViewDto.mapToView({
            items: mappedComments,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: totalCount,
        });
    }

    private sanitizeSortField(field: CommentsSortBy): 'created_at' {
        switch (field) {
            case CommentsSortBy.CreatedAt:
                return 'created_at';
            default:
                return 'created_at';
        }
    }
}
