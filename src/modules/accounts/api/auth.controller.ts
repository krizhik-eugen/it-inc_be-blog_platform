import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
    Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { MeViewDto } from './dto/view-dto';
import {
    ExtractSessionDataFromRequest,
    ExtractUserFromRequest,
} from '../guards/decorators';
import { SessionContextDto, UserContextDto } from '../guards/dto';
import { LocalAuthGuard } from '../guards/local';
import { JwtAuthGuard, RefreshTokenAuthGuard } from '../guards/bearer';
import {
    GetCurrentUserApi,
    LoginApi,
    LogoutApi,
    NewPasswordApi,
    PasswordRecoveryApi,
    RegisterNewUserApi,
    RegistrationConfirmationApi,
    RegistrationEmailResendingApi,
    UpdateRefreshTokenApi,
} from './swagger';
import { SuccessLoginViewDto } from './dto/view-dto';
import {
    CreateUserInputDto,
    NewPasswordInputDto,
    PasswordRecoveryInputDto,
    RegistrationConfirmationInputDto,
    RegistrationEmailResendingInputDto,
} from './dto/input-dto';
import {
    LoginUseCaseResponse,
    LoginUserCommand,
    LogoutUserCommand,
    PasswordRecoveryCommand,
    PasswordRecoveryConfirmationCommand,
    RegisterUserCommand,
    RegistrationConfirmationCommand,
    RegistrationEmailResendingCommand,
    UpdateRefreshTokenCommand,
    UpdateRefreshTokenUseCaseResponse,
} from '../application/use-cases/auth';
import { GetCurrentUserQuery } from '../application/queries/auth';

@UseGuards(ThrottlerGuard)
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
        @Req() request: Request,
    ): Promise<SuccessLoginViewDto> {
        const userAgent = request.headers['user-agent'] || '';
        const ip = request.ip || '';
        const { accessToken, refreshToken } = await this.commandBus.execute<
            LoginUserCommand,
            LoginUseCaseResponse
        >(new LoginUserCommand({ userId: user.id, ip, userAgent }));

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return { accessToken };
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Post('refresh-token')
    @UpdateRefreshTokenApi()
    @HttpCode(HttpStatus.OK)
    async updateRefreshToken(
        @Res({ passthrough: true }) response: Response,
        @ExtractSessionDataFromRequest() session: SessionContextDto,
        @Req() request: Request,
    ): Promise<SuccessLoginViewDto> {
        const ip = request.ip || '';
        const { accessToken, refreshToken } = await this.commandBus.execute<
            UpdateRefreshTokenCommand,
            UpdateRefreshTokenUseCaseResponse
        >(
            new UpdateRefreshTokenCommand({
                ...session,
                ip,
            }),
        );

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

    @UseGuards(RefreshTokenAuthGuard)
    @Post('logout')
    @LogoutApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(
        @ExtractSessionDataFromRequest() session: SessionContextDto,
    ): Promise<void> {
        await this.commandBus.execute<LogoutUserCommand, void>(
            new LogoutUserCommand(session),
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
