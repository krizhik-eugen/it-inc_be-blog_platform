import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    PaginatedUsersViewDto,
    UserViewDto,
} from '../dto/view-dto/users.view-dto';
import { CreateUserInputDto } from '../dto/input-dto/users.input-dto';
import { HttpErrorViewDto } from '../../../../core/dto/error.view-dto';

export const GetUsersApi = () => {
    return applyDecorators(
        ApiBasicAuth(),
        ApiOperation({
            summary: 'Returns all users',
        }),
        ApiOkResponse({
            description: 'Success',
            type: PaginatedUsersViewDto,
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
    );
};

export const CreateUserApi = () => {
    return applyDecorators(
        ApiBasicAuth(),
        ApiOperation({
            summary: 'Adds new user to the system',
        }),
        ApiCreatedResponse({
            description: 'Returns the newly created user',
            type: UserViewDto,
        }),
        ApiBadRequestResponse({
            type: HttpErrorViewDto,
            description:
                'If the inputModel has incorrect values <br/> <br/> <i>Note: If the error should be in the BLL, for example, "the email address is not unique", do not try to mix this error with input validation errors in the middleware, just return one element in the errors array</i>',
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
        ApiBody({
            type: CreateUserInputDto,
            description: 'Data for constructing new user',
        }),
    );
};

export const DeleteUserApi = () => {
    return applyDecorators(
        ApiBasicAuth(),
        ApiOperation({
            summary: 'Deletes user by id',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
        ApiNotFoundResponse({
            description: 'If specified user does not exist',
        }),
        ApiParam({
            name: 'id',
        }),
    );
};
