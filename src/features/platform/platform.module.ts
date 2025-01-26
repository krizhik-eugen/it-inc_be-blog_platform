import { Module } from '@nestjs/common';
import { Blog, BlogSchema } from './domain/blog.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './application/blogs.service';
import { BlogsQueryRepository } from './infrastructure/queryRepositories/blogs.query-repository';
import { BlogsRepository } from './infrastructure/repositories/blogs.repository';
import { BlogsController } from './api/blogs.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            // { name: Post.name, schema: PostSchema },
            // { name: Comment.name, schema: CommentSchema },
        ]),
    ],
    controllers: [BlogsController],
    providers: [
        BlogsService,
        BlogsRepository,
        BlogsQueryRepository,
        // PostsService,
        // PostsRepository,
        // PostsQueryRepository,
        // CommentsQueryRepository,
    ],
    exports: [MongooseModule],
})
export class PlatformModule {}
