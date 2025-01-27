import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { HTTP_STATUS_CODES } from '../../../constants';
import { BlogsQueryRepository } from '../infrastructure/queryRepositories/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { GetBlogsQueryParams } from './dto/query-params-dto/get-blogs-query-params.input-dto';
import {
    PaginatedBlogsViewDto,
    BlogViewDto,
} from './dto/view-dto/blogs.view-dto';
import { CreateBlogInputDto } from './dto/input-dto/create/blogs.input-dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
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
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: PaginatedBlogsViewDto,
    })
    async getAllBlogs(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedBlogsViewDto> {
        return await this.blogsQueryRepository.getAllBlogs(query);
    }

    @Post()
    @ApiBody({
        type: CreateBlogInputDto,
        description: 'Data for constructing new Blog entity',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.CREATED,
        description: 'Returns the newly created blog',
        type: BlogViewDto,
    })
    async createBlog(@Body() body: CreateBlogInputDto) {
        const newBlogId = await this.blogsService.createBlog(body);
        return await this.blogsQueryRepository.getByIdOrNotFoundFail(newBlogId);
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        description: 'Blog id',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: BlogViewDto,
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        description: 'Not found',
    })
    async getBlog(@Param('id') id: string) {
        return await this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }

    @Put(':id')
    @ApiParam({
        name: 'id',
        description: 'Blog id',
    })
    @ApiBody({
        type: UpdateBlogInputDto,
        description: 'Data for updating blog',
        required: false,
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NO_CONTENT,
        description: 'No content',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        description: 'Not found',
    })
    async updateBlog(
        @Param('id') id: string,
        @Body() body: UpdateBlogInputDto,
    ) {
        return await this.blogsService.updateBlog(id, body);
    }

    @Get(':id/posts')
    @ApiParam({
        name: 'id',
        description: 'Blog id',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: PaginatedBlogsViewDto,
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        description: 'Not found',
    })
    async getAllBlogPosts(
        @Param('id') id: string,
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedPostsViewDto> {
        return await this.postsQueryRepository.getAllBlogPosts(query, id, null);
    }

    @Post(':id')
    @ApiParam({
        name: 'id',
        description: 'Blog id',
    })
    @ApiBody({
        type: CreatePostInputDto,
        description: 'Data for constructing new Post entity',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.CREATED,
        description: 'Returns the newly created post',
        type: PostViewDto,
    })
    async createBlogPost(
        @Param('id') id: string,
        @Body() body: CreateBlogPostInputDto,
    ) {
        const newPostId = await this.postsService.createPost({
            ...body,
            blogId: id,
        });

        return await this.postsQueryRepository.getByIdOrNotFoundFail(
            newPostId,
            null,
        );
    }

    @Delete(':id')
    @ApiParam({
        name: 'id',
        description: 'Blog id',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NO_CONTENT,
        description: 'No content',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        description: 'Not found',
    })
    @HttpCode(HTTP_STATUS_CODES.NO_CONTENT)
    async deleteBlog(@Param('id') id: string) {
        return await this.blogsService.deleteBlog(id);
    }
}
