import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    CommentsRepository,
    CommentsQueryRepository,
    LikesRepository,
    LikesQueryRepository,
    PostgresBlogsRepository,
    PostgresBlogsQueryRepository,
    PostgresPostsQueryRepository,
    PostgresPostsRepository,
} from './infrastructure';
import {
    CreateBlogUseCase,
    DeleteBlogUseCase,
    UpdateBlogPostUseCase,
    UpdateBlogUseCase,
} from './application/use-cases/blogs';
import {
    GetBlogByIdQueryHandler,
    GetBlogPostsQueryHandler,
    GetBlogsQueryHandler,
} from './application/queries/blogs';
import { CreatePostUseCase } from './application/use-cases/posts';
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
import { Comment, CommentSchema } from './domain/comment.entity';
import { Like, LikeSchema } from './domain/like.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { BlogsController } from './api/blogs.controller';
import { PostsController } from './api/posts.controller';
import { CommentsController } from './api/comments.controller';
import { BlogIsExistentConstraint } from './api/validation';
import { SaBlogsController } from './api/sa.blogs.controller';

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    UpdateCommentLikeStatusUseCase,
    UpdateBlogPostUseCase,
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
    CommentsQueryRepository,
    CommentsRepository,
    LikesRepository,
    LikesQueryRepository,
    PostgresBlogsRepository,
    PostgresBlogsQueryRepository,
    PostgresPostsRepository,
    PostgresPostsQueryRepository,
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
            { name: Like.name, schema: LikeSchema },
        ]),
        AccountsModule,
    ],
    controllers: [
        BlogsController,
        SaBlogsController,
        PostsController,
        CommentsController,
    ],
    providers: [
        ...repositories,
        ...useCases,
        ...queries,
        BlogIsExistentConstraint,
    ],
    exports: [MongooseModule],
})
export class PlatformModule {}
