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

@Controller('posts')
export class PostsController {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private postsService: PostsService,
    ) {}

    @Get(':id')
    @ApiParam({
        name: 'id',
        description: 'Blog id',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: PaginatedPostsViewDto,
    })
    async getAllPosts(
        @Param('id') id: string,
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedPostsViewDto> {
        return await this.postsQueryRepository.getAllPosts(query, id);
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
    async updatePost(
        @Param('id') id: string,
        @Body() body: UpdatePostInputDto,
    ) {
        return await this.postsService.updatePost(id, body);
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
