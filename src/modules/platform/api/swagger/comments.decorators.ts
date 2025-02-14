import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommentViewDto } from '../dto/view-dto/comments.view-dto';
import { UpdateCommentInputDto } from '../dto/input-dto/update/comments.input-dto';
import { HttpErrorViewDto } from '../../../../core/dto/error.view-dto';
import { UpdateLikeInputDto } from '../dto/input-dto/update/likes.input-dto';

export const UpdateCommentLikeStatusApi = () => {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Makes like/dislike/reset operation',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiBadRequestResponse({
            type: HttpErrorViewDto,
            description: 'If the inputModel has incorrect values',
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
        ApiParam({
            name: 'commentId',
        }),
        ApiBody({
            type: UpdateLikeInputDto,
            description: 'Like model for make like/dislike/reset operation',
        }),
    );
};

export const GetCommentApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Returns comment by id',
        }),
        ApiOkResponse({
            description: 'Success',
            type: CommentViewDto,
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiParam({
            name: 'commentId',
        }),
    );
};

export const UpdateCommentApi = () => {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Updates existing comment by id with InputModel',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiBadRequestResponse({
            type: HttpErrorViewDto,
            description: 'If the inputModel has incorrect values',
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
        ApiForbiddenResponse({
            description: 'If the current user is not the author of the comment',
        }),
        ApiParam({
            name: 'commentId',
        }),
        ApiBody({
            type: UpdateCommentInputDto,
            description: 'Data for updating post',
            required: false,
        }),
    );
};

export const DeleteCommentApi = () => {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Deletes comment by id',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
        ApiForbiddenResponse({
            description: 'If the current user is not the author of the comment',
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiParam({
            name: 'commentId',
        }),
    );
};
