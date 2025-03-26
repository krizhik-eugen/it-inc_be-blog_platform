import { randomUUID } from 'crypto';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { getDeviceTitle } from '../../../../../helpers';
import {
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../constants';
import { TypedJwtService } from '../../typedJwtService';
import { SessionsRepository } from '../../../infrastructure';

export class LoginUseCaseResponse {
    accessToken: string;
    refreshToken: string;
}

export class LoginUserCommand {
    constructor(
        public dto: { userId: number; ip: string; userAgent: string },
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
        private accessTokenContext: TypedJwtService,

        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private refreshTokenContext: TypedJwtService,

        private sessionRepository: SessionsRepository,
    ) {}

    async execute({ dto }: LoginUserCommand): Promise<LoginUseCaseResponse> {
        const accessToken = this.accessTokenContext.sign({ id: dto.userId });

        const deviceId = randomUUID();
        const refreshToken = this.refreshTokenContext.sign({
            userId: dto.userId,
            deviceId,
        });

        const decodedIssuedToken =
            this.refreshTokenContext.decode(refreshToken);

        await this.sessionRepository.createSession({
            userId: dto.userId,
            deviceId,
            deviceName: getDeviceTitle(dto.userAgent),
            ip: dto.ip,
            iat: decodedIssuedToken.iat!,
            exp: decodedIssuedToken.exp!,
        });

        return { accessToken, refreshToken };
    }
}
