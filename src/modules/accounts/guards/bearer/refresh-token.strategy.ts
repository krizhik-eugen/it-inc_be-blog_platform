import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { AccountsConfig } from '../../config';
import { TypedJwtPayload } from '../../application/typedJwtService';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'refresh-jwt',
) {
    constructor(accountsConfig: AccountsConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies['refreshToken'] as string,
            ]),
            ignoreExpiration: false,
            secretOrKey: accountsConfig.jwtSecret,
        });
    }

    async validate(payload: TypedJwtPayload) {
        if (!payload.id || !payload.deviceId) {
            throw new UnauthorizedException('Invalid refresh token payload');
        }

        return Promise.resolve({
            userId: payload.userId,
            deviceId: payload.deviceId,
        });
    }
}
