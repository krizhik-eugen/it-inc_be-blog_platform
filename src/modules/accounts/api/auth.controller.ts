import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/queryRepositories/users.query-repository';
import { UsersService } from '../application/users.service';
import { MeViewDto } from './dto/view-dto/users.view-dto';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { SuccessLoginViewDto } from './dto/view-dto/success-login.view.dto';
import { AuthService } from '../application/auth.service';
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

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @LoginApi()
    @HttpCode(HttpStatus.OK)
    async login(
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<SuccessLoginViewDto> {
        const accessToken = await this.authService.login(user.id);

        return accessToken;
    }

    @Post('password-recovery')
    @PasswordRecoveryApi()
    //TODO: add ratelimit
    @HttpCode(HttpStatus.NO_CONTENT)
    async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
        await this.authService.passwordRecovery(body.email);
    }

    @Post('new-password')
    @NewPasswordApi()
    //TODO: add ratelimit
    @HttpCode(HttpStatus.NO_CONTENT)
    async confirmPasswordRecovery(@Body() body: NewPasswordInputDto) {
        await this.authService.confirmPasswordRecovery(body);
    }

    @Post('registration-confirmation')
    @RegistrationConfirmationApi()
    //TODO: add ratelimit
    @HttpCode(HttpStatus.NO_CONTENT)
    async confirmRegistrationEmail(
        @Body() body: RegistrationConfirmationInputDto,
    ) {
        await this.authService.confirmUserEmail(body.code);
    }

    @Post('registration')
    @RegisterNewUserApi()
    //TODO: add ratelimit
    @HttpCode(HttpStatus.NO_CONTENT)
    async registerNewUser(@Body() body: CreateUserInputDto) {
        await this.authService.registerNewUser(body);
    }

    @Post('registration-email-resending')
    @RegistrationEmailResendingApi()
    //TODO: add ratelimit
    @HttpCode(HttpStatus.NO_CONTENT)
    async resendRegistrationCode(
        @Body() body: RegistrationEmailResendingInputDto,
    ) {
        await this.authService.resendRegistrationCode(body.email);
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
