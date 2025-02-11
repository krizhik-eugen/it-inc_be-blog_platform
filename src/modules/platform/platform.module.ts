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

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
];
const repositories = [
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
    ],
    controllers: [BlogsController, PostsController, CommentsController],
    providers: [...repositories, ...useCases],
    exports: [MongooseModule],
})
export class PlatformModule {}
