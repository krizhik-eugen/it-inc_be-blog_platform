import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';

import { BlogsQueryRepository } from '../infrastructure/queryRepositories/blogs.query-repository';
import { GetBlogsQueryParams } from './dto/query-params-dto/get-blogs-query-params.input-dto';
import {
    PaginatedBlogsViewDto,
    BlogViewDto,
} from './dto/view-dto/blogs.view-dto';
import { CreateBlogInputDto } from './dto/input-dto/create/blogs.input-dto';
import { UpdateBlogInputDto } from './dto/input-dto/update/blogs.input-dto';
import { PostsQueryRepository } from '../infrastructure/queryRepositories/posts.query-repository';
import {
    PaginatedPostsViewDto,
    PostViewDto,
} from './dto/view-dto/posts.view-dto';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import { CreateBlogPostInputDto } from './dto/input-dto/create/posts.input-dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation-transformation-pipe.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/use-cases/blogs/create-blog.use-case';
import { UpdateBlogCommand } from '../application/use-cases/blogs/update-blog.use-case';
import { DeleteBlogCommand } from '../application/use-cases/blogs/delete-blog.use-case';
import {
    CreateBlogApi,
    CreateBlogPostApi,
    DeleteBlogApi,
    GetAllBlogPostsApi,
    GetAllBlogsApi,
    GetBlogApi,
    UpdateBlogApi,
} from './swagger/blogs.decorators';
import { CreatePostCommand } from '../application/use-cases/posts/create-post.use-case';
import { BasicAuthGuard } from '../../accounts/guards/basic/basic-auth.guard';

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private postsQueryRepository: PostsQueryRepository,
        private commandBus: CommandBus,
    ) {}

    @Get()
    @GetAllBlogsApi()
    async getAllBlogs(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedBlogsViewDto> {
        return await this.blogsQueryRepository.getAllBlogs(query);
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    @CreateBlogApi()
    async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
        const newBlogId = await this.commandBus.execute<
            CreateBlogCommand,
            string
        >(new CreateBlogCommand(body));
        return await this.blogsQueryRepository.getByIdOrNotFoundFail(newBlogId);
    }

    @Get(':blogId/posts')
    @GetAllBlogPostsApi()
    async getAllBlogPosts(
        @Param('blogId', ObjectIdValidationPipe) blogId: string,
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedPostsViewDto> {
        return await this.postsQueryRepository.getAllBlogPosts(
            query,
            blogId,
            null,
        );
    }

    @UseGuards(BasicAuthGuard)
    @Post(':blogId/posts')
    @CreateBlogPostApi()
    async createBlogPost(
        @Param('blogId', ObjectIdValidationPipe) blogId: string,
        @Body() body: CreateBlogPostInputDto,
    ): Promise<PostViewDto> {
        const newPostId = await this.commandBus.execute<
            CreatePostCommand,
            string
        >(
            new CreatePostCommand({
                ...body,
                blogId,
            }),
        );

        return await this.postsQueryRepository.getByIdOrNotFoundFail(
            newPostId,
            null,
        );
    }

    @Get(':id')
    @GetBlogApi()
    async getBlog(
        @Param('id', ObjectIdValidationPipe) id: string,
    ): Promise<BlogViewDto> {
        return await this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @UseGuards(BasicAuthGuard)
    @Put(':id')
    @UpdateBlogApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param('id', ObjectIdValidationPipe) id: string,
        @Body() body: UpdateBlogInputDto,
    ): Promise<void> {
        return await this.commandBus.execute<UpdateBlogCommand, void>(
            new UpdateBlogCommand(id, body),
        );
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    @DeleteBlogApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(
        @Param('id', ObjectIdValidationPipe) id: string,
    ): Promise<void> {
        return await this.commandBus.execute<DeleteBlogCommand, void>(
            new DeleteBlogCommand(id),
        );
    }
}
