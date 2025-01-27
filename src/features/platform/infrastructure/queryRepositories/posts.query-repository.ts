import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from '../../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { Post, PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/dto/view-dto/posts.view-dto';
import { LikeStatus } from '../../types';
import { Blog, BlogModelType } from '../../domain/blog.entity';

export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
    ) {}

    async getByIdOrNotFoundFail(
        id: string,
        userId: string | null,
    ): Promise<PostViewDto> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        }).exec();

        if (!post) {
            throw new NotFoundException('post not found');
        }

        //TODO: get likes and newest likes
        return PostViewDto.mapToView(post, LikeStatus.None, []);
    }

    async getAllPosts(
        query: GetPostsQueryParams,
        userId: string | null,
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        const findQuery: FilterQuery<Post> = { deletedAt: null };

        const result = await this.PostModel.find(findQuery)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);

        const postsCount = await this.PostModel.countDocuments(findQuery);

        //TODO: get likes and newest likes
        const mappedPosts = result.map((post) =>
            PostViewDto.mapToView(post, LikeStatus.None, []),
        );

        return PaginatedViewDto.mapToView({
            items: mappedPosts,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: postsCount,
        });
    }

    async getAllBlogPosts(
        query: GetPostsQueryParams,
        blogId: string,
        userId: string | null,
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        const blog = await this.BlogModel.findOne({
            _id: blogId,
            deletedAt: null,
        });

        if (!blog) {
            throw new NotFoundException('blog not found');
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

        //TODO: get likes and newest likes
        const mappedPosts = result.map((post) =>
            PostViewDto.mapToView(post, LikeStatus.None, []),
        );

        return PaginatedViewDto.mapToView({
            items: mappedPosts,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: postsCount,
        });
    }
}
