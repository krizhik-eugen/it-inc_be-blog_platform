import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import {
    BlogsQueryRepository,
    BlogsRepository,
    PostsRepository,
    PostsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    LikesRepository,
    LikesQueryRepository,
} from './infrastructure';
import {
    CreateBlogUseCase,
    DeleteBlogUseCase,
    UpdateBlogUseCase,
} from './application/use-cases/blogs';
import {
    GetBlogByIdQueryHandler,
    GetBlogPostsQueryHandler,
    GetBlogsQueryHandler,
} from './application/queries/blogs';
import {
    CreateCommentUseCase,
    CreatePostUseCase,
    DeletePostUseCase,
    UpdatePostLikeStatusUseCase,
    UpdatePostUseCase,
} from './application/use-cases/posts';
import {
    GetCommentsQueryHandler,
    GetPostByIdQueryHandler,
    GetPostsQueryHandler,
} from './application/queries/posts';
import {
    DeleteCommentUseCase,
    UpdateCommentLikeStatusUseCase,
    UpdateCommentUseCase,
} from './application/use-cases/comments';
import { GetCommentByIdQueryHandler } from './application/queries/comments';
import { Post, PostSchema } from './domain/post.entity';
import { Comment, CommentSchema } from './domain/comment.entity';
import { Like, LikeSchema } from './domain/like.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { BlogsController } from './api/blogs.controller';
import { PostsController } from './api/posts.controller';
import { CommentsController } from './api/comments.controller';
import { BlogIsExistentConstraint } from './api/validation';

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
