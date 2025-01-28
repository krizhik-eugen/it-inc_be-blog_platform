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
import { PostsQueryRepository } from '../infrastructure/queryRepositories/posts.query-repository';
import { PostsService } from '../application/posts.service';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import {
    PaginatedPostsViewDto,
    PostViewDto,
} from './dto/view-dto/posts.view-dto';
import { CreatePostInputDto } from './dto/input-dto/create/posts.input-dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
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

    @Get()
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: PaginatedPostsViewDto,
    })
    async getAllPosts(
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedPostsViewDto> {
        return await this.postsQueryRepository.getAllPosts(query, null);
    }

    @Post()
    @ApiBody({
        type: CreatePostInputDto,
        description: 'Data for constructing new Post entity',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.CREATED,
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
    @ApiParam({
        name: 'id',
        description: 'Post id',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: PostViewDto,
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        description: 'Not found',
    })
    async getPost(@Param('id') id: string) {
        return await this.postsQueryRepository.getByIdOrNotFoundFail(id, null);
    }

    @Put(':id')
    @ApiParam({
        name: 'id',
        description: 'Post id',
    })
    @ApiBody({
        type: UpdatePostInputDto,
        description: 'Data for updating post',
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
    @HttpCode(HTTP_STATUS_CODES.NO_CONTENT)
    async updatePost(
        @Param('id') id: string,
        @Body() body: UpdatePostInputDto,
    ) {
        return await this.postsService.updatePost(id, body);
    }

    @Get(':id/comments')
    @ApiParam({
        name: 'id',
        description: 'Post id',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: PaginatedCommentsViewDto,
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        description: 'Not found',
    })
    async getAllPostComments(
        @Param('id') id: string,
        @Query() query: GetCommentsQueryParams,
    ): Promise<PaginatedCommentsViewDto> {
        return await this.commentsQueryRepository.getAllPostComments(
            query,
            id,
            null,
        );
    }

    //TODO: implement update like status

    @Delete(':id')
    @ApiParam({
        name: 'id',
        description: 'Post id',
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
    async deletePost(@Param('id') id: string) {
        return await this.postsService.deletePost(id);
    }
}
