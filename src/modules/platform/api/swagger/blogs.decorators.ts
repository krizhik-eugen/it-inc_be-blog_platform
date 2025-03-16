import { applyDecorators } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import {
    PaginatedPostgresBlogsViewDto,
    PaginatedPostgresPostsViewDto,
    PostgresBlogViewDto,
    PostgresPostViewDto,
} from '../dto/view-dto';
import {
    CreateBlogInputDto,
    CreatePostInputDto,
} from '../dto/input-dto/create';
import { UpdateBlogInputDto } from '../dto/input-dto/update';

export const GetAllBlogsApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Returns blogs with pagination',
        }),
        ApiOkResponse({
            description: 'Success',
            type: PaginatedPostgresBlogsViewDto,
        }),
    );
};

export const CreateBlogApi = () => {
    return applyDecorators(
        ApiBasicAuth(),
        ApiOperation({
            summary: 'Creates a new blog',
        }),
        ApiCreatedResponse({
            description: 'Returns a newly created blog',
            type: PostgresBlogViewDto,
        }),
        ApiBody({
            type: CreateBlogInputDto,
            description: 'Data for constructing new MongoBlog entity',
        }),
    );
};

export const GetAllBlogPostsApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Returns all posts for specified blog',
        }),
        ApiOkResponse({
            description: 'Success',
            type: PaginatedPostgresPostsViewDto,
        }),
        ApiNotFoundResponse({
            description: 'If specified blog does not exist',
        }),
        ApiParam({
            name: 'blogId',
        }),
    );
};

export const CreateBlogPostApi = () => {
    return applyDecorators(
        ApiBasicAuth(),
        ApiOperation({
            summary: 'Creates a new post for specified blog',
        }),
        ApiCreatedResponse({
            description: 'Returns a newly created post',
            type: PostgresPostViewDto,
        }),
        ApiNotFoundResponse({
            description: 'If specified blog does not exist',
        }),
        ApiParam({
            name: 'blogId',
        }),
        ApiBody({
            type: CreatePostInputDto,
            description: 'Data for constructing new MongoPost entity',
        }),
    );
};

export const GetBlogApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Returns blog by id',
        }),
        ApiOkResponse({
            description: 'Success',
            type: PostgresBlogViewDto,
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiParam({
            name: 'id',
        }),
    );
};

export const UpdateBlogApi = () => {
    return applyDecorators(
        ApiBasicAuth(),
        ApiOperation({
            summary: 'Updates existing blog by id with InputModel',
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
            type: UpdateBlogInputDto,
            description: 'Data for updating blog',
            required: false,
        }),
    );
};

export const DeleteBlogApi = () => {
    return applyDecorators(
        ApiBasicAuth(),
        ApiOperation({
            summary: 'Deletes existing blog by id',
        }),
        ApiParam({
            name: 'id',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
    );
};
