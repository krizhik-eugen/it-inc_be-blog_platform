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

import { PostsQueryRepository } from '../infrastructure/queryRepositories/posts.query-repository';
import { PostsService } from '../application/posts.service';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import {
    PaginatedPostsViewDto,
    PostViewDto,
} from './dto/view-dto/posts.view-dto';
import { CreatePostInputDto } from './dto/input-dto/create/posts.input-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdatePostInputDto } from './dto/input-dto/update/posts.input-dto';
import { PaginatedCommentsViewDto } from './dto/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../infrastructure/queryRepositories/comments.query-repository';
import { GetCommentsQueryParams } from './dto/query-params-dto/get-comments-query-params.input-dto';

@Controller('posts')
export class PostsController {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private postsService: PostsService,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {}

    @Get(':postId/comments')
    @ApiOperation({
        summary: 'Returns comments for specified post',
    })
    @ApiParam({
        name: 'postId',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: PaginatedCommentsViewDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'If specified post not found',
    })
    async getAllPostComments(
        @Param('postId') postId: string,
        @Query() query: GetCommentsQueryParams,
    ): Promise<PaginatedCommentsViewDto> {
        return await this.commentsQueryRepository.getAllPostComments(
            query,
            postId,
            null,
        );
    }

    @Get()
    @ApiOperation({
        summary: 'Returns all posts',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: PaginatedPostsViewDto,
    })
    async getAllPosts(
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedPostsViewDto> {
        return await this.postsQueryRepository.getAllPosts(query, null);
    }

    @Post()
    @ApiOperation({
        summary: 'Creates a new post',
    })
    @ApiBody({
        type: CreatePostInputDto,
        description: 'Data for constructing new Post entity',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns the newly created post',
        type: PostViewDto,
    })
    async createPost(@Body() body: CreatePostInputDto) {
        const newPostId = await this.postsService.createPost(body);
        return await this.postsQueryRepository.getByIdOrNotFoundFail(
            newPostId,
            null,
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Returns post by id',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
        type: PostViewDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found',
    })
    async getPost(@Param('id') id: string) {
        return await this.postsQueryRepository.getByIdOrNotFoundFail(id, null);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updates existing post by id with InputModel',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiBody({
        type: UpdatePostInputDto,
        description: 'Data for updating post',
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
    async updatePost(
        @Param('id') id: string,
        @Body() body: UpdatePostInputDto,
    ) {
        return await this.postsService.updatePost(id, body);
    }

    //TODO: implement update like status

    @Delete(':id')
    @ApiOperation({
        summary: 'Deletes post by id',
    })
    @ApiParam({
        name: 'id',
        description: 'Post id',
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
    async deletePost(@Param('id') id: string) {
        return await this.postsService.deletePost(id);
    }
}
