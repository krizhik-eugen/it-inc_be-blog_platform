import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MeViewDto } from '../dto/view-dto/users.view-dto';
import {
    CreateUserInputDto,
    LoginUserInputDto,
} from '../dto/input-dto/users.input-dto';
import { HttpErrorResponse } from '../../../../core/dto/error.view-dto';
import { SuccessLoginViewDto } from '../dto/view-dto/success-login.view.dto';
import { RegistrationConfirmationInputDto } from '../dto/input-dto/registration-confirmation.input-dto';
import { RegistrationEmailResendingInputDto } from '../dto/input-dto/registration-email-resending.input-dto';

export const LoginApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Try login user to the system',
        }),
        ApiOkResponse({
            description:
                'Returns JWT accessToken (expired after 5 minutes) in body.',
            type: SuccessLoginViewDto,
        }),
        ApiBadRequestResponse({
            type: HttpErrorResponse,
            description: 'If the inputModel has incorrect values',
        }),
        ApiUnauthorizedResponse({
            description: 'If the password or login or email is wrong',
        }),
        ApiBody({ type: LoginUserInputDto }),
    );
};

export const GetCurrentUserApi = () => {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Get info about current user',
        }),
        ApiOkResponse({
            description: 'Success',
            type: MeViewDto,
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
    );
};

export const RegisterNewUserApi = () => {
    return applyDecorators(
        ApiOperation({
            summary:
                'Registration in the system. Email with confirmation code will be sent to provided email address',
        }),
        ApiCreatedResponse({
            description:
                'Input data is accepted. Email with confirmation code will be sent to provided email address',
        }),
        ApiBadRequestResponse({
            type: HttpErrorResponse,
            description:
                'If the inputModel has incorrect values (in particular if the user with the provided email or login already exists)',
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
        ApiBody({ type: CreateUserInputDto }),
    );
};

export const RegistrationConfirmationApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Confirm registration',
        }),
        ApiCreatedResponse({
            description: 'Email has been verified. Account has been activated',
        }),
        ApiBadRequestResponse({
            type: HttpErrorResponse,
            description:
                'If the confirmation code is incorrect, expired or already been applied',
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
        ApiBody({ type: RegistrationConfirmationInputDto }),
    );
};

export const RegistrationEmailResendingApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Resend confirmation registration email if user exists',
        }),
        ApiCreatedResponse({
            description:
                'Input data is accepted. Email with confirmation code will be sent to provided email. Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
        }),
        ApiBadRequestResponse({
            type: HttpErrorResponse,
            description: 'If the inputModel has incorrect value',
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
        ApiBody({ type: RegistrationEmailResendingInputDto }),
    );
};
