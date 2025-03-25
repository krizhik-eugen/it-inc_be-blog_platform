import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../accounts/guards/basic';
import { ExtractUserIfExistsFromRequest } from '../../accounts/guards/decorators';
import { UserContextDto } from '../../accounts/guards/dto';
import {
    CreateBlogApi,
    CreateBlogPostApi,
    DeleteBlogApi,
    DeleteBlogPostApi,
    GetAllBlogPostsApi,
    GetAllBlogsApi,
    UpdateBlogApi,
    UpdateBlogPostApi,
} from './swagger';
import {
    GetBlogsQueryParams,
    GetPostsQueryParams,
} from './dto/query-params-dto';
import {
    PaginatedBlogsViewDto,
    BlogViewDto,
    PaginatedPostgresPostsViewDto,
    PostViewDto,
} from './dto/view-dto';
import {
    CreateBlogInputDto,
    CreateBlogPostInputDto,
} from './dto/input-dto/create';
import { UpdateBlogInputDto, UpdatePostInputDto } from './dto/input-dto/update';
import {
    GetBlogByIdQuery,
    GetBlogPostsQuery,
    GetBlogsQuery,
} from '../application/queries/blogs';
import {
    CreateBlogCommand,
    DeleteBlogCommand,
    DeleteBlogPostCommand,
    UpdateBlogCommand,
    UpdateBlogPostCommand,
} from '../application/use-cases/blogs';
import { CreatePostCommand } from '../application/use-cases/posts';
import { GetPostByIdQuery } from '../application/queries/posts';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class SaBlogsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @Get()
    @GetAllBlogsApi()
    async getAllBlogs(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedBlogsViewDto> {
        return this.queryBus.execute(new GetBlogsQuery(query));
    }

    @Post()
    @CreateBlogApi()
    async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
        const newBlogId = await this.commandBus.execute<
            CreateBlogCommand,
            number
        >(new CreateBlogCommand(body));
        return this.queryBus.execute(new GetBlogByIdQuery(newBlogId));
    }

    @Get(':blogId/posts')
    @GetAllBlogPostsApi()
    async getAllBlogPosts(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Query() query: GetPostsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PaginatedPostgresPostsViewDto> {
        return this.queryBus.execute<
            GetBlogPostsQuery,
            PaginatedPostgresPostsViewDto
        >(new GetBlogPostsQuery(query, blogId, user?.id));
    }

    @Post(':blogId/posts')
    @CreateBlogPostApi()
    async createBlogPost(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Body() body: CreateBlogPostInputDto,
    ): Promise<PostViewDto> {
        const newPostId = await this.commandBus.execute<
            CreatePostCommand,
            number
        >(
            new CreatePostCommand({
                ...body,
                blogId,
            }),
        );
        return this.queryBus.execute<GetPostByIdQuery, PostViewDto>(
            new GetPostByIdQuery(newPostId, null),
        );
    }

    @Put(':blogId')
    @UpdateBlogApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Body() body: UpdateBlogInputDto,
    ): Promise<void> {
        return this.commandBus.execute<UpdateBlogCommand, void>(
            new UpdateBlogCommand(blogId, body),
        );
    }

    @Put(':blogId/posts/:postId')
    @UpdateBlogPostApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() body: UpdatePostInputDto,
    ): Promise<void> {
        return this.commandBus.execute<UpdateBlogPostCommand, void>(
            new UpdateBlogPostCommand(postId, blogId, body),
        );
    }

    @Delete(':blogId')
    @DeleteBlogApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(
        @Param('blogId', ParseIntPipe) blogId: number,
    ): Promise<void> {
        return this.commandBus.execute<DeleteBlogCommand, void>(
            new DeleteBlogCommand(blogId),
        );
    }

    @Delete(':blogId/posts/:postId')
    @DeleteBlogPostApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Param('postId', ParseIntPipe) postId: number,
    ): Promise<void> {
        return this.commandBus.execute<DeleteBlogPostCommand, void>(
            new DeleteBlogPostCommand(postId, blogId),
        );
    }
}
