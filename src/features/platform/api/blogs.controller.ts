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
} from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { BlogsQueryRepository } from '../infrastructure/queryRepositories/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
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
import {
    CreateBlogPostInputDto,
    CreatePostInputDto,
} from './dto/input-dto/create/posts.input-dto';
import { PostsService } from '../application/posts.service';

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogsService: BlogsService,
        private blogsQueryRepository: BlogsQueryRepository,
        private postsService: PostsService,
        private postsQueryRepository: PostsQueryRepository,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Returns blogs with pagination',
    })
    @ApiOkResponse({
        description: 'Success',
        type: PaginatedBlogsViewDto,
    })
    async getAllBlogs(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedBlogsViewDto> {
        return await this.blogsQueryRepository.getAllBlogs(query);
    }

    @Post()
    @ApiOperation({
        summary: 'Creates a new blog',
    })
    @ApiCreatedResponse({
        description: 'Returns a newly created blog',
        type: BlogViewDto,
    })
    @ApiBody({
        type: CreateBlogInputDto,
        description: 'Data for constructing new Blog entity',
    })
    async createBlog(@Body() body: CreateBlogInputDto) {
        const newBlogId = await this.blogsService.createBlog(body);
        return await this.blogsQueryRepository.getByIdOrNotFoundFail(newBlogId);
    }

    @Get(':blogId/posts')
    @ApiOperation({
        summary: 'Returns all posts for specified blog',
    })
    @ApiOkResponse({
        description: 'Success',
        type: PaginatedPostsViewDto,
    })
    @ApiNotFoundResponse({
        description: 'If specified blog does not exist',
    })
    @ApiParam({
        name: 'blogId',
    })
    async getAllBlogPosts(
        @Param('blogId') blogId: string,
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedPostsViewDto> {
        return await this.postsQueryRepository.getAllBlogPosts(
            query,
            blogId,
            null,
        );
    }

    @Post(':blogId/posts')
    @ApiOperation({
        summary: 'Creates a new post for specified blog',
    })
    @ApiCreatedResponse({
        description: 'Returns a newly created post',
        type: PostViewDto,
    })
    @ApiNotFoundResponse({
        description: 'If specified blog does not exist',
    })
    @ApiParam({
        name: 'blogId',
    })
    @ApiBody({
        type: CreatePostInputDto,
        description: 'Data for constructing new Post entity',
    })
    async createBlogPost(
        @Param('blogId') blogId: string,
        @Body() body: CreateBlogPostInputDto,
    ) {
        const newPostId = await this.postsService.createPost({
            ...body,
            blogId,
        });

        return await this.postsQueryRepository.getByIdOrNotFoundFail(
            newPostId,
            null,
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Returns blog by id',
    })
    @ApiOkResponse({
        description: 'Success',
        type: BlogViewDto,
    })
    @ApiNotFoundResponse({
        description: 'Not found',
    })
    @ApiParam({
        name: 'id',
    })
    async getBlog(@Param('id') id: string) {
        return await this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updates existing blog by id with InputModel',
    })
    @ApiNoContentResponse({
        description: 'No content',
    })
    @ApiNotFoundResponse({
        description: 'Not found',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiBody({
        type: UpdateBlogInputDto,
        description: 'Data for updating blog',
        required: false,
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param('id') id: string,
        @Body() body: UpdateBlogInputDto,
    ) {
        return await this.blogsService.updateBlog(id, body);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Deletes existing blog by id',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiNoContentResponse({
        description: 'No content',
    })
    @ApiNotFoundResponse({
        description: 'Not found',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') id: string) {
        return await this.blogsService.deleteBlog(id);
    }
}
