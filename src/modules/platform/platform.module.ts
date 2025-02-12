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

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    CreateCommentUseCase,
];
const repositories = [
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    CommentsRepository,
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
        AccountsModule,
    ],
    controllers: [BlogsController, PostsController, CommentsController],
    providers: [...repositories, ...useCases],
    exports: [MongooseModule],
})
export class PlatformModule {}
