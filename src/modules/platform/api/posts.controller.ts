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
import { PostsQueryRepository } from '../infrastructure/queryRepositories/posts.query-repository';
import { PostsService } from '../application/posts.service';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import {
    PaginatedPostsViewDto,
    PostViewDto,
} from './dto/view-dto/posts.view-dto';
import { CreatePostInputDto } from './dto/input-dto/create/posts.input-dto';
import { UpdatePostInputDto } from './dto/input-dto/update/posts.input-dto';
import { PaginatedCommentsViewDto } from './dto/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../infrastructure/queryRepositories/comments.query-repository';
import { GetCommentsQueryParams } from './dto/query-params-dto/get-comments-query-params.input-dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation-transformation-pipe.service';

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
    @ApiOkResponse({
        description: 'Success',
        type: PaginatedCommentsViewDto,
    })
    @ApiNotFoundResponse({
        description: 'If specified post not found',
    })
    @ApiParam({
        name: 'postId',
    })
    async getAllPostComments(
        @Param('postId', ObjectIdValidationPipe) postId: string,
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
    @ApiOkResponse({
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
    @ApiCreatedResponse({
        description: 'Returns the newly created post',
        type: PostViewDto,
    })
    @ApiBody({
        type: CreatePostInputDto,
        description: 'Data for constructing new Post entity',
    })
    async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
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
    @ApiOkResponse({
        description: 'Success',
        type: PostViewDto,
    })
    @ApiNotFoundResponse({
        description: 'Not found',
    })
    @ApiParam({
        name: 'id',
    })
    async getPost(
        @Param('id', ObjectIdValidationPipe) id: string,
    ): Promise<PostViewDto> {
        return await this.postsQueryRepository.getByIdOrNotFoundFail(id, null);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updates existing post by id with InputModel',
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
        type: UpdatePostInputDto,
        description: 'Data for updating post',
        required: false,
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param('id', ObjectIdValidationPipe) id: string,
        @Body() body: UpdatePostInputDto,
    ): Promise<void> {
        return await this.postsService.updatePost(id, body);
    }

    //TODO: implement update like status

    @Delete(':id')
    @ApiOperation({
        summary: 'Deletes post by id',
    })
    @ApiNoContentResponse({
        description: 'No content',
    })
    @ApiNotFoundResponse({
        description: 'Not found',
    })
    @ApiParam({
        name: 'id',
        description: 'Post id',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(
        @Param('id', ObjectIdValidationPipe) id: string,
    ): Promise<void> {
        return await this.postsService.deletePost(id);
    }
}
