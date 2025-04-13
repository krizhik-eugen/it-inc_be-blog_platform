import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import {
    GetPostsQueryParams,
    PostsSortBy,
} from '../../api/dto/query-params-dto';
import { PaginatedPostsViewDto, PostViewDto } from '../../api/dto/view-dto';
import { LikeParentType, LikeStatus } from '../../domain/like.entity';
import { LikesQueryRepository } from './likes.query-repository';
import { PostEntity, PostWithLikesCount } from '../../domain/post.entity';
import { LikesRepository } from '../repositories/likes.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { BlogEntity } from '../../domain/blog.entity';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectRepository(PostEntity)
        private postsRepo: Repository<PostEntity>,
        @InjectRepository(BlogEntity)
        private blogsRepo: Repository<BlogEntity>,
        private likesQueryRepository: LikesQueryRepository,
        private likesRepository: LikesRepository,
    ) {}

    async getByIdOrNotFoundFail({
        postId,
        userId,
    }: {
        postId: number;
        userId: number | null;
    }): Promise<PostViewDto> {
        const post = await this.postsRepo.findOne({
            where: { id: postId, deleted_at: IsNull() },
        });

        if (!post) {
            throw NotFoundDomainException.create('Post not found');
        }

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
            const blog = await this.blogsRepo.findOne({
                where: { id: blogId, deleted_at: IsNull() },
            });

            if (!blog) {
                throw NotFoundDomainException.create('Blog not found');
            }
        }

        const qb = this.postsRepo
            .createQueryBuilder('p')
            .where('p.deleted_at IS NULL');

        if (blogId) {
            qb.andWhere('p.blog_id = :blogId', { blogId });
        }

        const sortBy = this.sanitizeSortField(query.sortBy);
        qb.orderBy(sortBy, query.sortDirection.toUpperCase() as 'ASC' | 'DESC');

        qb.skip(query.calculateSkip()).take(query.pageSize);

        const [posts, totalCount] = await qb.getManyAndCount();

        const postsIds: number[] = [];

        const mappedPosts = posts.map((post) => {
            const postWithLikes: PostWithLikesCount = {
                ...post,
                likes_count: 0,
                dislikes_count: 0,
            };
            postsIds.push(post.id);
            return PostViewDto.mapToView(postWithLikes, LikeStatus.None, []);
        });

        if (userId) {
            const parentLikes =
                await this.likesRepository.getParentsLikesAndCountArray({
                    parentIdsArray: postsIds,
                    userId,
                    parentType: LikeParentType.Post,
                });
            mappedPosts.forEach((post) => {
                const like = parentLikes.find(
                    (like) => like.parent_id === parseInt(post.id),
                );
                post.extendedLikesInfo.myStatus =
                    like?.like_status ?? LikeStatus.None;
                post.extendedLikesInfo.likesCount = like ? like.likes_count : 0;
                post.extendedLikesInfo.dislikesCount = like
                    ? like.dislikes_count
                    : 0;
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
