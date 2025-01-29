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
import { BlogsQueryRepository } from '../infrastructure/queryRepositories/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { GetBlogsQueryParams } from './dto/query-params-dto/get-blogs-query-params.input-dto';
import {
    PaginatedBlogsViewDto,
    BlogViewDto,
} from './dto/view-dto/blogs.view-dto';
import { CreateBlogInputDto } from './dto/input-dto/create/blogs.input-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
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
    @ApiResponse({
        status: HttpStatus.OK,
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
    @ApiBody({
        type: CreateBlogInputDto,
        description: 'Data for constructing new Blog entity',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns a newly created blog',
        type: BlogViewDto,
    })
    async createBlog(@Body() body: CreateBlogInputDto) {
        const newBlogId = await this.blogsService.createBlog(body);
        return await this.blogsQueryRepository.getByIdOrNotFoundFail(newBlogId);
    }

    @Get(':blogId/posts')
    @ApiOperation({
        summary: 'Returns all posts for specified blog',
    })
    @ApiParam({
        name: 'blogId',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: PaginatedPostsViewDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'If specified blog does not exist',
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
    @ApiParam({
        name: 'blogId',
    })
    @ApiBody({
        type: CreatePostInputDto,
        description: 'Data for constructing new Post entity',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns a newly created post',
        type: PostViewDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'If specified blog does not exist',
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
    @ApiParam({
        name: 'id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: BlogViewDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found',
    })
    async getBlog(@Param('id') id: string) {
        return await this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updates existing blog by id with InputModel',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiBody({
        type: UpdateBlogInputDto,
        description: 'Data for updating blog',
        required: false,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'No content',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found',
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
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'No content',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') id: string) {
        return await this.blogsService.deleteBlog(id);
    }
}
