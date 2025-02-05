import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiNoContentResponse,
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
import { HttpErrorViewDto } from '../../../../core/dto/error.view-dto';
import { SuccessLoginViewDto } from '../dto/view-dto/success-login.view.dto';
import { RegistrationConfirmationInputDto } from '../dto/input-dto/registration-confirmation.input-dto';
import { RegistrationEmailResendingInputDto } from '../dto/input-dto/registration-email-resending.input-dto';
import { PasswordRecoveryInputDto } from '../dto/input-dto/password-recovery.input-dto';
import { NewPasswordInputDto } from '../dto/input-dto/new-password.input-dto';

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
