import { applyDecorators } from '@nestjs/common';
import {
    ApiCookieAuth,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostgresSessionViewDto } from '../dto/view-dto';

export const GetSessionsApi = () => {
    return applyDecorators(
        ApiCookieAuth(),
        ApiOperation({
            summary:
                'Returns all devices with active sessions for current user',
        }),
        ApiOkResponse({
            description: 'Success',
            type: [PostgresSessionViewDto],
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
    );
};

export const DeleteAllSessionsApi = () => {
    return applyDecorators(
        ApiCookieAuth(),
        ApiOperation({
            summary: 'Terminate all sessions except current',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
    );
};

export const DeleteSessionApi = () => {
    return applyDecorators(
        ApiCookieAuth(),
        ApiOperation({
            summary: 'Terminate all sessions except current',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
        ApiForbiddenResponse({
            description: 'If trying to delete the deviceId of other user',
        }),
        ApiNotFoundResponse({
            description: 'Not found',
        }),
        ApiParam({
            name: 'deviceId',
        }),
    );
};
