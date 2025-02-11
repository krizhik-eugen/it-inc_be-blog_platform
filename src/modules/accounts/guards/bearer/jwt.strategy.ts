import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserContextDto } from '../dto/user-context.dto';
import { AccountsConfig } from '../../config/accounts.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(accountsConfig: AccountsConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: accountsConfig.jwtSecret,
        });
    }

    async validate(payload: UserContextDto) {
        return Promise.resolve({ id: payload.id });
    }
}
