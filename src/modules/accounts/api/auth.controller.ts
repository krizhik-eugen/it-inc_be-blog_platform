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
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { UsersQueryRepository } from '../infrastructure/queryRepositories/users.query-repository';
import { MeViewDto } from './dto/view-dto/users.view-dto';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { SuccessLoginViewDto } from './dto/view-dto/success-login.view.dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import {
    GetCurrentUserApi,
    LoginApi,
    NewPasswordApi,
    PasswordRecoveryApi,
    RegisterNewUserApi,
    RegistrationConfirmationApi,
    RegistrationEmailResendingApi,
} from './swagger/auth.decorators';
import { CreateUserInputDto } from './dto/input-dto/users.input-dto';
import { RegistrationConfirmationInputDto } from './dto/input-dto/registration-confirmation.input-dto';
import { RegistrationEmailResendingInputDto } from './dto/input-dto/registration-email-resending.input-dto';
import { PasswordRecoveryInputDto } from './dto/input-dto/password-recovery.input-dto';
import { NewPasswordInputDto } from './dto/input-dto/new-password.input-dto';
import {
    LoginUseCaseResponse,
    LoginUserCommand,
} from '../application/use-cases/login-user.use-case';
import { RegisterUserCommand } from '../application/use-cases/register-user.use-case';
import { RegistrationEmailResendingCommand } from '../application/use-cases/registration-email-resending.use-case';
import { PasswordRecoveryCommand } from '../application/use-cases/password-recovery.use-case';
import { PasswordRecoveryConfirmationCommand } from '../application/use-cases/password-recovery-confirmation.use-case';
import { RegistrationConfirmationCommand } from '../application/use-cases/registration-confirmation.use-case';

// @UseGuards(ThrottlerGuard) //Temporary switch off throttler
@Controller('auth')
export class AuthController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private commandBus: CommandBus,
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
        >(new PasswordRecoveryConfirmationCommand(body));
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
        return await this.usersQueryRepository.getCurrentUserByIdOrNotFoundFail(
            user.id,
        );
    }
}
