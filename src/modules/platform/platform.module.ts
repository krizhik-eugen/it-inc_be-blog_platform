import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import { BlogsQueryRepository } from './infrastructure/queryRepositories/blogs.query-repository';
import { BlogsRepository } from './infrastructure/repositories/blogs.repository';
import { BlogsController } from './api/blogs.controller';
import { UpdatePostUseCase } from './application/use-cases/posts/update-post.use-case';
import { Post, PostSchema } from './domain/post.entity';
import { PostsRepository } from './infrastructure/repositories/posts.repository';
import { PostsQueryRepository } from './infrastructure/queryRepositories/posts.query-repository';
import { PostsController } from './api/posts.controller';
import { CommentsQueryRepository } from './infrastructure/queryRepositories/comments.query-repository';
import { Comment, CommentSchema } from './domain/comment.entity';
import { CommentsController } from './api/comments.controller';
import { CreateBlogUseCase } from './application/use-cases/blogs/create-blog.use-case';
import { UpdateBlogUseCase } from './application/use-cases/blogs/update-blog.use-case';
import { DeleteBlogUseCase } from './application/use-cases/blogs/delete-blog.use-case';
import { CreatePostUseCase } from './application/use-cases/posts/create-post.use-case';
import { AccountsModule } from '../accounts/accounts.module';
import { CommentsRepository } from './infrastructure/repositories/comments.repository';
import { CreateCommentUseCase } from './application/use-cases/posts/create-post-comment.use-case';
import { UpdateCommentUseCase } from './application/use-cases/comments/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/comments/delete-comment.use-case';
import { UpdateCommentLikeStatusUseCase } from './application/use-cases/comments/update-comment-like-status.use-case';
import { Like, LikeSchema } from './domain/like.entity';
import { LikesRepository } from './infrastructure/repositories/likes.repository';
import { LikesQueryRepository } from './infrastructure/queryRepositories/likes.query-repository';
import { DeletePostUseCase } from './application/use-cases/posts/delete-post.use-case';
import { UpdatePostLikeStatusUseCase } from './application/use-cases/posts/update-post-like-status.use-case';
import { BlogIsExistentConstraint } from './api/validation/blog-is-existent.decorator';
import { GetBlogByIdQueryHandler } from './application/queries/blogs/get-blog-by-id.query-handler';
import { GetBlogsQueryHandler } from './application/queries/blogs/get-blogs.query-handler';
import { GetBlogPostsQueryHandler } from './application/queries/blogs/get-blog-posts.query-handler';
import { GetPostByIdQueryHandler } from './application/queries/posts/get-post-by-id.query-handler';
import { GetPostsQueryHandler } from './application/queries/posts/get-posts.query-handler';
import { GetCommentByIdQueryHandler } from './application/queries/comments/get-comment-by-id.query-handler';
import { GetCommentsQueryHandler } from './application/queries/posts/get-post-comments.query-handler';

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    UpdateCommentLikeStatusUseCase,
    DeletePostUseCase,
    UpdatePostLikeStatusUseCase,
];
const queries = [
    GetBlogByIdQueryHandler,
    GetBlogsQueryHandler,
    GetBlogPostsQueryHandler,
    GetPostByIdQueryHandler,
    GetPostsQueryHandler,
    GetCommentByIdQueryHandler,
    GetCommentsQueryHandler,
];
const repositories = [
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    CommentsRepository,
    LikesRepository,
    LikesQueryRepository,
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Like.name, schema: LikeSchema },
        ]),
        AccountsModule,
    ],
    controllers: [BlogsController, PostsController, CommentsController],
    providers: [
        ...repositories,
        ...useCases,
        ...queries,
        BlogIsExistentConstraint,
    ],
    exports: [MongooseModule],
})
export class PlatformModule {}
