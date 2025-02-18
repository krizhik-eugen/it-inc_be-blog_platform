import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../constants';

export class LoginUseCaseResponse {
    accessToken: string;
    refreshToken: string;
}

export class LoginUserCommand {
    constructor(public dto: { userId: string }) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
        private accessTokenContext: JwtService,

        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private refreshTokenContext: JwtService,
    ) {}

    async execute({ dto }: LoginUserCommand): Promise<LoginUseCaseResponse> {
        const accessToken = this.accessTokenContext.sign({ id: dto.userId });

        const refreshToken = this.refreshTokenContext.sign({
            id: dto.userId,
            deviceId: 'deviceId',
        });

        return Promise.resolve({ accessToken, refreshToken });
    }
}
