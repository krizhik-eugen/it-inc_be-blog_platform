import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application/auth.service';
import { UserContextDto } from '../dto/user-context.dto';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'loginOrEmail' });
    }

    async validate(
        loginOrEmail: string,
        password: string,
    ): Promise<UserContextDto> {
        const user = await this.authService.validateUser(
            loginOrEmail,
            password,
        );

        if (!user) {
            throw UnauthorizedDomainException.create('Invalid credentials');
        }
        return user;
    }
}
