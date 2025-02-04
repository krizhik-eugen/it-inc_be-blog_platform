import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from '../../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { Post, PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/dto/view-dto/posts.view-dto';
import { LikeStatus } from '../../types';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
    ) {}

    async getByIdOrNotFoundFail(
        id: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        userId: string | null,
    ): Promise<PostViewDto> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        }).exec();

        if (!post) {
            throw new NotFoundDomainException('post not found');
        }

        //TODO: get likes and newest likes
        return PostViewDto.mapToView(post, LikeStatus.None, []);
    }

    async getAllPosts(
        query: GetPostsQueryParams,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        userId: string | null,
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        const blog = await this.BlogModel.findOne({
            _id: blogId,
            deletedAt: null,
        });

        if (!blog) {
            throw new NotFoundDomainException('blog not found');
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
