import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    LikesRepository,
    LikesQueryRepository,
    BlogsRepository,
    PostgresBlogsQueryRepository,
    PostgresPostsQueryRepository,
    PostsRepository,
    CommentsRepository,
    CommentsQueryRepository,
} from './infrastructure';
import {
    CreateBlogUseCase,
    DeleteBlogPostUseCase,
    DeleteBlogUseCase,
    UpdateBlogPostUseCase,
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
} from './application/use-cases/posts';
import {
    GetCommentsQueryHandler,
    GetPostByIdQueryHandler,
    GetPostsQueryHandler,
} from './application/queries/posts';
import { Like, LikeSchema } from './domain/like.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { BlogsController } from './api/blogs.controller';
import { PostsController } from './api/posts.controller';
import { BlogIsExistentConstraint } from './api/validation';
import { SaBlogsController } from './api/sa.blogs.controller';
import { GetCommentByIdQueryHandler } from './application/queries/comments';
import { CommentsController } from './api/comments.controller';
import {
    DeleteCommentUseCase,
    UpdateCommentUseCase,
} from './application/use-cases/comments';

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    CreateCommentUseCase,
    UpdateBlogPostUseCase,
    DeleteBlogPostUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
];
const queries = [
    GetBlogByIdQueryHandler,
    GetBlogsQueryHandler,
    GetBlogPostsQueryHandler,
    GetPostByIdQueryHandler,
    GetPostsQueryHandler,
    GetCommentsQueryHandler,
    GetCommentByIdQueryHandler,
];
const repositories = [
    CommentsRepository,
    LikesRepository,
    LikesQueryRepository,
    BlogsRepository,
    PostgresBlogsQueryRepository,
    PostsRepository,
    PostgresPostsQueryRepository,
    CommentsQueryRepository,
];

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
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
