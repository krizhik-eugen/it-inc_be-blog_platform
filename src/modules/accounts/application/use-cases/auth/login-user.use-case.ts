import { randomUUID } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { getDeviceTitle } from '../../../../../helpers';
import {
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../constants';
import { TypedJwtService } from '../../typedJwtService';
import { SessionsRepository } from '../../../infrastructure/repositories/sessions.repository';
import { Session, SessionModelType } from '../../../domain/session.entity';

export class LoginUseCaseResponse {
    accessToken: string;
    refreshToken: string;
}

export class LoginUserCommand {
    constructor(
        public dto: { userId: string; ip: string; userAgent: string },
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
        private accessTokenContext: TypedJwtService,

        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private refreshTokenContext: TypedJwtService,

        @InjectModel(Session.name)
        private SessionModel: SessionModelType,

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

        const newSession = this.SessionModel.createInstance({
            userId: dto.userId,
            deviceId,
            deviceName: getDeviceTitle(dto.userAgent),
            ip: dto.ip,
            iat: decodedIssuedToken.iat!,
            exp: decodedIssuedToken.exp!,
        });

        await this.sessionRepository.save(newSession);

        return Promise.resolve({ accessToken, refreshToken });
    }
}
