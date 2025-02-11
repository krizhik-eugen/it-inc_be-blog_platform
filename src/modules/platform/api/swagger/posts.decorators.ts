import { applyDecorators } from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';

import {
    PaginatedPostsViewDto,
    PostViewDto,
} from '../dto/view-dto/posts.view-dto';
import { CreatePostInputDto } from '../dto/input-dto/create/posts.input-dto';
import { PaginatedCommentsViewDto } from '../dto/view-dto/comments.view-dto';
import { UpdatePostInputDto } from '../dto/input-dto/update/posts.input-dto';

export const GetAllPostCommentsApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Returns comments for specified post',
        }),
        ApiOkResponse({
            description: 'Success',
            type: PaginatedCommentsViewDto,
        }),
        ApiNotFoundResponse({
            description: 'If specified post not found',
        }),
        ApiParam({
            name: 'postId',
        }),
    );
};

export const GetAllPostsApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Returns all posts',
        }),
        ApiOkResponse({
            description: 'Success',
            type: PaginatedPostsViewDto,
        }),
    );
};

export const CreatePostApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Creates a new post',
        }),
        ApiCreatedResponse({
            description: 'Returns the newly created post',
            type: PostViewDto,
        }),
        ApiBody({
            type: CreatePostInputDto,
            description: 'Data for constructing new Post entity',
        }),
    );
};

export const GetPostApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Returns post by id',
        }),
        ApiOkResponse({
            description: 'Success',
            type: PostViewDto,
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiParam({
            name: 'id',
        }),
    );
};

export const UpdatePostApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Updates existing post by id with InputModel',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiParam({
            name: 'id',
        }),
        ApiBody({
            type: UpdatePostInputDto,
            description: 'Data for updating post',
            required: false,
        }),
    );
};

export const DeletePostApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Deletes post by id',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiParam({
            name: 'id',
            description: 'Post id',
        }),
    );
};
