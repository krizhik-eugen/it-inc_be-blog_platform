import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { AccountsConfig } from '../../config';
import { TypedJwtPayload } from '../../application/typedJwtService';
import { SessionsRepository } from '../../infrastructure';
import { UnauthorizedDomainException } from '../../../../core/exceptions';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'refresh-jwt',
) {
    constructor(
        accountsConfig: AccountsConfig,
        private sessionRepository: SessionsRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies['refreshToken'] as string,
            ]),
            ignoreExpiration: true, // handle expiration check manually
            secretOrKey: accountsConfig.jwtSecret,
        });
    }

    async validate(payload: TypedJwtPayload) {
        if (payload.exp && payload.exp < Date.now() / 1000) {
            const foundSession =
                await this.sessionRepository.findByDeviceIdNonDeleted(
                    payload.deviceId,
                );

            if (foundSession) {
                foundSession.makeDeleted();
                await this.sessionRepository.save(foundSession);
            }

            throw UnauthorizedDomainException.create('Refresh token expired');
        }

        return Promise.resolve({
            userId: payload.userId,
            deviceId: payload.deviceId,
            iat: payload.iat,
        });
    }
}
