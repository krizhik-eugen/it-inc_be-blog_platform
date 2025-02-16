import { PassportStrategy } from '@nestjs/passport';
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application/auth.service';
import { UserContextDto } from '../dto/user-context.dto';
import { LoginUserInputDto } from '../../api/dto/input-dto/users.input-dto';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'loginOrEmail' });
    }

    async validate(
        loginOrEmail: string,
        password: string,
    ): Promise<UserContextDto> {
        const credentials = new LoginUserInputDto();
        credentials.loginOrEmail = loginOrEmail;
        credentials.password = password;

        const errors = await validate(credentials);

        if (errors.length > 0) {
            throw new BadRequestException('Invalid loginOrEmail or password');
        }

        const user = await this.authService.validateUser(
            loginOrEmail,
            password,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }
}
