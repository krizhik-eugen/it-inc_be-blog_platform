import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { LikeParentType, LikeStatus } from '../../domain/like.entity';
import { PostsRepository } from '../repositories/posts.repository';
import {
    CommentViewDto,
    PaginatedCommentsViewDto,
} from '../../api/dto/view-dto/comments.view-dto';
import {
    CommentEntity,
    CommentWithUserLogin,
} from '../../domain/comment.entity';
import {
    CommentsSortBy,
    GetCommentsQueryParams,
} from '../../api/dto/query-params-dto';
import { LikesRepository } from '../repositories/likes.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentsRepo: Repository<CommentEntity>,
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
        const comment = await this.commentsRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .addSelect(['u.login'])
            .where('c.id = :id', { id: commentId })
            .andWhere('c.deleted_at IS NULL')
            .getOne();

        if (!comment) {
            throw NotFoundDomainException.create('Comment is not found');
        }
        const commentWithUserLogin: CommentWithUserLogin = {
            ...comment,
            user_login: comment.user?.login,
        };

        let likeStatus: LikeStatus = LikeStatus.None;
        const commentWithLikesCount = {
            ...commentWithUserLogin,
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

        // const sqlQuery = `
        //     SELECT c.*, u.login AS user_login, COUNT(*) OVER() as total_count
        //     FROM public.comments c JOIN public.users u ON c.user_id = u.id
        //     WHERE c.post_id = $1 AND c.deleted_at IS NULL
        //     ORDER BY ${this.sanitizeSortField(query.sortBy)} ${query.sortDirection}
        //     LIMIT $2 OFFSET $3
        // `;

        // const queryParams: (string | number)[] = [
        //     postId,
        //     query.pageSize,
        //     query.calculateSkip(),
        // ];

        // const data = await this.dataSource.query<
        //     (CommentWithUserLogin & { total_count: string })[]
        // >(sqlQuery, queryParams);

        // const totalCount = data.length ? parseInt(data[0].total_count) : 0;

        const sortField = this.sanitizeSortField(query.sortBy);

        const [comments, totalCount] = await this.commentsRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .addSelect(['u.login'])
            .where('c.post_id = :postId', { postId })
            .andWhere('c.deleted_at IS NULL')
            .orderBy(
                `c.${sortField}`,
                query.sortDirection.toUpperCase() as 'ASC' | 'DESC',
            )
            .getManyAndCount();

        const commentsIds = comments.map((comment) => comment.id);
        const mappedComments = comments.map((comment) => {
            const commentWithLikesCount = {
                ...comment,
                user_login: comment.user?.login,
                likes_count: 0,
                dislikes_count: 0,
            };
            return CommentViewDto.mapToView(
                commentWithLikesCount,
                LikeStatus.None,
            );
        });

        if (userId && commentsIds.length > 0) {
            const parentLikes =
                await this.likesRepository.getParentsLikesAndCountArray({
                    parentIdsArray: commentsIds,
                    userId,
                    parentType: LikeParentType.Comment,
                });

            mappedComments.forEach((comment) => {
                const like = parentLikes.find(
                    (like) => like.parent_id === parseInt(comment.id),
                );
                comment.likesInfo.myStatus =
                    like?.like_status ?? LikeStatus.None;
                comment.likesInfo.likesCount = like ? like.likes_count : 0;
                comment.likesInfo.dislikesCount = like
                    ? like.dislikes_count
                    : 0;
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
