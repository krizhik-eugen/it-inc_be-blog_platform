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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from '../../../core/pipes';
import { BasicAuthGuard } from '../../../modules/accounts/guards/basic';
import { JwtOptionalAuthGuard } from '../../../modules/accounts/guards/bearer';
import { ExtractUserIfExistsFromRequest } from '../../../modules/accounts/guards/decorators';
import { UserContextDto } from '../../../modules/accounts/guards/dto';
import {
    CreateBlogApi,
    CreateBlogPostApi,
    DeleteBlogApi,
    GetAllBlogPostsApi,
    GetAllBlogsApi,
    GetBlogApi,
    UpdateBlogApi,
} from './swagger';
import {
    GetBlogsQueryParams,
    GetPostsQueryParams,
} from './dto/query-params-dto';
import {
    BlogViewDto,
    PaginatedBlogsViewDto,
    PaginatedPostsViewDto,
    PostViewDto,
} from './dto/view-dto';
import {
    CreateBlogInputDto,
    CreateBlogPostInputDto,
} from './dto/input-dto/create';
import { UpdateBlogInputDto } from './dto/input-dto/update';
import {
    GetBlogByIdQuery,
    GetBlogPostsQuery,
    GetBlogsQuery,
} from '../application/queries/blogs';
import {
    CreateBlogCommand,
    DeleteBlogCommand,
    UpdateBlogCommand,
} from '../application/use-cases/blogs';
import { CreatePostCommand } from '../application/use-cases/posts';
import { GetPostByIdQuery } from '../application/queries/posts';

@Controller('blogs')
export class BlogsController {
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

    @UseGuards(BasicAuthGuard)
    @Post()
    @CreateBlogApi()
    async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
        const newBlogId = await this.commandBus.execute<
            CreateBlogCommand,
            string
        >(new CreateBlogCommand(body));
        return this.queryBus.execute(new GetBlogByIdQuery(newBlogId));
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':blogId/posts')
    @GetAllBlogPostsApi()
    async getAllBlogPosts(
        @Param('blogId', ObjectIdValidationPipe) blogId: string,
        @Query() query: GetPostsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PaginatedPostsViewDto> {
        return this.queryBus.execute<GetBlogPostsQuery, PaginatedPostsViewDto>(
            new GetBlogPostsQuery(query, blogId, user?.id),
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
        return this.queryBus.execute<GetPostByIdQuery, PostViewDto>(
            new GetPostByIdQuery(newPostId, null),
        );
    }

    @Get(':blogId')
    @GetBlogApi()
    async getBlog(
        @Param('blogId', ObjectIdValidationPipe) blogId: string,
    ): Promise<BlogViewDto> {
        return this.queryBus.execute<GetBlogByIdQuery, BlogViewDto>(
            new GetBlogByIdQuery(blogId),
        );
    }

    @UseGuards(BasicAuthGuard)
    @Put(':blogId')
    @UpdateBlogApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param('blogId', ObjectIdValidationPipe) blogId: string,
        @Body() body: UpdateBlogInputDto,
    ): Promise<void> {
        return this.commandBus.execute<UpdateBlogCommand, void>(
            new UpdateBlogCommand(blogId, body),
        );
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':blogId')
    @DeleteBlogApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(
        @Param('blogId', ObjectIdValidationPipe) blogId: string,
    ): Promise<void> {
        return this.commandBus.execute<DeleteBlogCommand, void>(
            new DeleteBlogCommand(blogId),
        );
    }
}
