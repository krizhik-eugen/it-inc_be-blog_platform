import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCookieAuth,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpErrorViewDto } from '../../../../core/dto';
import { PostgresUserViewDto, SuccessLoginViewDto } from '../dto/view-dto';
import {
    CreateUserInputDto,
    LoginUserInputDto,
    RegistrationConfirmationInputDto,
    RegistrationEmailResendingInputDto,
    NewPasswordInputDto,
    PasswordRecoveryInputDto,
} from '../dto/input-dto';

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
            type: HttpErrorViewDto,
            description: 'If the inputModel has incorrect values',
        }),
        ApiUnauthorizedResponse({
            description: 'If the password or login or email is wrong',
        }),
        ApiBody({ type: LoginUserInputDto }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
    );
};

export const UpdateRefreshTokenApi = () => {
    return applyDecorators(
        ApiOperation({
            summary:
                'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken which will be revoked after refreshing) Device LastActiveDate should be overwritten by issued Date of new refresh token',
        }),
        ApiOkResponse({
            description:
                'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
            type: SuccessLoginViewDto,
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
    );
};

export const PasswordRecoveryApi = () => {
    return applyDecorators(
        ApiOperation({
            summary:
                'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside link',
        }),
        ApiNoContentResponse({
            description:
                "Even if current email is not registered (to prevent user's email detection)",
        }),
        ApiBadRequestResponse({
            type: HttpErrorViewDto,
            description:
                'If the inputModel has invalid email (for example 222^gmail.com',
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
        ApiBody({ type: PasswordRecoveryInputDto }),
    );
};

export const NewPasswordApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Confirm password recovery',
        }),
        ApiNoContentResponse({
            description: 'If code is valid and new password is accepted',
        }),
        ApiBadRequestResponse({
            type: HttpErrorViewDto,
            description:
                'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
        ApiBody({ type: NewPasswordInputDto }),
    );
};

export const RegistrationConfirmationApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Confirm registration',
        }),
        ApiNoContentResponse({
            description: 'Email has been verified. Account has been activated',
        }),
        ApiBadRequestResponse({
            type: HttpErrorViewDto,
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

export const RegisterNewUserApi = () => {
    return applyDecorators(
        ApiOperation({
            summary:
                'Registration in the system. Email with confirmation code will be sent to provided email address',
        }),
        ApiNoContentResponse({
            description:
                'Input data is accepted. Email with confirmation code will be sent to provided email address',
        }),
        ApiBadRequestResponse({
            type: HttpErrorViewDto,
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

export const RegistrationEmailResendingApi = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Resend confirmation registration email if user exists',
        }),
        ApiNoContentResponse({
            description:
                'Input data is accepted. Email with confirmation code will be sent to provided email. Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
        }),
        ApiBadRequestResponse({
            type: HttpErrorViewDto,
            description: 'If the inputModel has incorrect value',
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
        ApiBody({ type: RegistrationEmailResendingInputDto }),
    );
};

export const LogoutApi = () => {
    return applyDecorators(
        ApiCookieAuth(),
        ApiOperation({
            summary:
                'In cookie client must send the correct refreshToken which will be revoked',
        }),
        ApiNoContentResponse({
            description: 'No content',
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
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
            type: PostgresUserViewDto,
        }),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
        }),
        ApiTooManyRequestsResponse({
            description:
                'More than 5 attempts from one IP-address during 10 seconds',
        }),
    );
};
