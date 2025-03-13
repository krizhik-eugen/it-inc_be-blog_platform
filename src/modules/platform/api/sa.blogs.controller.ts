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
import { BasicAuthGuard } from '../../accounts/guards/basic';
import { JwtOptionalAuthGuard } from '../../accounts/guards/bearer';
import { ExtractUserIfExistsFromRequest } from '../../accounts/guards/decorators';
import { UserContextDto } from '../../accounts/guards/dto';
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
    MongoBlogViewDto,
    PaginatedMongoBlogsViewDto,
    PaginatedPostsViewDto,
    PostgresBlogViewDto,
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

@Controller('sa/blogs')
export class BlogsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @Get()
    @GetAllBlogsApi()
    async getAllBlogs(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedMongoBlogsViewDto> {
        return this.queryBus.execute(new GetBlogsQuery(query));
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    @CreateBlogApi()
    async createBlog(
        @Body() body: CreateBlogInputDto,
    ): Promise<PostgresBlogViewDto> {
        const newBlogId = await this.commandBus.execute<
            CreateBlogCommand,
            number
        >(new CreateBlogCommand(body));
        return this.queryBus.execute(new GetBlogByIdQuery(newBlogId));
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':blogId/posts')
    @GetAllBlogPostsApi()
    async getAllBlogPosts(
        @Param('blogId') blogId: number,
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
        @Param('blogId') blogId: number,
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
        @Param('blogId') blogId: number,
    ): Promise<PostgresBlogViewDto> {
        return this.queryBus.execute<GetBlogByIdQuery, PostgresBlogViewDto>(
            new GetBlogByIdQuery(blogId),
        );
    }

    @UseGuards(BasicAuthGuard)
    @Put(':blogId')
    @UpdateBlogApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param('blogId') blogId: number,
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
    async deleteBlog(@Param('blogId') blogId: number): Promise<void> {
        return this.commandBus.execute<DeleteBlogCommand, void>(
            new DeleteBlogCommand(blogId),
        );
    }
}
