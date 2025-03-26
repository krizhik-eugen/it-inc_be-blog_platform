import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtOptionalAuthGuard } from '../../../modules/accounts/guards/bearer';
import { ExtractUserIfExistsFromRequest } from '../../../modules/accounts/guards/decorators';
import { UserContextDto } from '../../../modules/accounts/guards/dto';
import { GetAllBlogPostsApi, GetAllBlogsApi, GetBlogApi } from './swagger';
import {
    GetBlogsQueryParams,
    GetPostsQueryParams,
} from './dto/query-params-dto';
import {
    PaginatedBlogsViewDto,
    PaginatedPostsViewDto,
    BlogViewDto,
} from './dto/view-dto';

import {
    GetBlogByIdQuery,
    GetBlogPostsQuery,
    GetBlogsQuery,
} from '../application/queries/blogs';

@Controller('blogs')
export class BlogsController {
    constructor(private queryBus: QueryBus) {}

    @Get()
    @GetAllBlogsApi()
    async getAllBlogs(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedBlogsViewDto> {
        return this.queryBus.execute(new GetBlogsQuery(query));
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':blogId/posts')
    @GetAllBlogPostsApi()
    async getAllBlogPosts(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Query() query: GetPostsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PaginatedPostsViewDto> {
        return this.queryBus.execute<GetBlogPostsQuery, PaginatedPostsViewDto>(
            new GetBlogPostsQuery(query, blogId, user?.id),
        );
    }

    @Get(':blogId')
    @GetBlogApi()
    async getBlog(
        @Param('blogId', ParseIntPipe) blogId: number,
    ): Promise<BlogViewDto> {
        return this.queryBus.execute<GetBlogByIdQuery, BlogViewDto>(
            new GetBlogByIdQuery(blogId),
        );
    }
}
