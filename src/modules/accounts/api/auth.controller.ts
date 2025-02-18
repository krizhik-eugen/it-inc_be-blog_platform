import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { MeViewDto } from './dto/view-dto';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { SuccessLoginViewDto } from './dto/view-dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import {
    GetCurrentUserApi,
    LoginApi,
    NewPasswordApi,
    PasswordRecoveryApi,
    RegisterNewUserApi,
    RegistrationConfirmationApi,
    RegistrationEmailResendingApi,
} from './swagger';
import {
    LoginUseCaseResponse,
    LoginUserCommand,
    PasswordRecoveryCommand,
    PasswordRecoveryConfirmationCommand,
    RegisterUserCommand,
    RegistrationConfirmationCommand,
    RegistrationEmailResendingCommand,
} from '../application/use-cases/auth';
import { GetCurrentUserQuery } from '../application/queries/auth';
import {
    CreateUserInputDto,
    NewPasswordInputDto,
    PasswordRecoveryInputDto,
    RegistrationConfirmationInputDto,
    RegistrationEmailResendingInputDto,
} from './dto/input-dto';

@UseGuards(ThrottlerGuard) //Temporary switch off throttler
@Controller('auth')
export class AuthController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @LoginApi()
    @HttpCode(HttpStatus.OK)
    async login(
        @Res({ passthrough: true }) response: Response,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<SuccessLoginViewDto> {
        const { accessToken, refreshToken } = await this.commandBus.execute<
            LoginUserCommand,
            LoginUseCaseResponse
        >(new LoginUserCommand({ userId: user.id }));

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return { accessToken };
    }

    @Post('password-recovery')
    @PasswordRecoveryApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async passwordRecovery(
        @Body() body: PasswordRecoveryInputDto,
    ): Promise<void> {
        await this.commandBus.execute<PasswordRecoveryCommand, void>(
            new PasswordRecoveryCommand({ email: body.email }),
        );
    }

    @Post('new-password')
    @NewPasswordApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async confirmPasswordRecovery(
        @Body() body: NewPasswordInputDto,
    ): Promise<void> {
        await this.commandBus.execute<
            PasswordRecoveryConfirmationCommand,
            void
        >(
            new PasswordRecoveryConfirmationCommand({
                newPassword: body.newPassword,
                recoveryCode: body.recoveryCode,
            }),
        );
    }

    @Post('registration-confirmation')
    @RegistrationConfirmationApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async confirmRegistrationEmail(
        @Body() body: RegistrationConfirmationInputDto,
    ): Promise<void> {
        await this.commandBus.execute<RegistrationConfirmationCommand, void>(
            new RegistrationConfirmationCommand({ code: body.code }),
        );
    }

    @Post('registration')
    @RegisterNewUserApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async registerNewUser(@Body() body: CreateUserInputDto): Promise<void> {
        await this.commandBus.execute<RegisterUserCommand, void>(
            new RegisterUserCommand({
                email: body.email,
                login: body.login,
                password: body.password,
            }),
        );
    }

    @Post('registration-email-resending')
    @RegistrationEmailResendingApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async resendRegistrationCode(
        @Body() body: RegistrationEmailResendingInputDto,
    ): Promise<void> {
        await this.commandBus.execute<RegistrationEmailResendingCommand, void>(
            new RegistrationEmailResendingCommand({ email: body.email }),
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @GetCurrentUserApi()
    async getCurrentUser(
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<MeViewDto> {
        return this.queryBus.execute<GetCurrentUserQuery, MeViewDto>(
            new GetCurrentUserQuery(user.id),
        );
    }
}
