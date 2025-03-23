import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../constants';
import { TypedJwtPayload, TypedJwtService } from '../../typedJwtService';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { PostgresSessionsRepository } from '../../../infrastructure';

export class UpdateRefreshTokenUseCaseResponse {
    accessToken: string;
    refreshToken: string;
}

export class UpdateRefreshTokenCommand {
    constructor(
        public dto: {
            ip: string;
        } & TypedJwtPayload,
    ) {}
}

@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenUseCase
    implements ICommandHandler<UpdateRefreshTokenCommand>
{
    constructor(
        @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
        private accessTokenContext: TypedJwtService,

        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private refreshTokenContext: TypedJwtService,

        private postgresSessionRepository: PostgresSessionsRepository,
    ) {}

    async execute({
        dto,
    }: UpdateRefreshTokenCommand): Promise<UpdateRefreshTokenUseCaseResponse> {
        const foundSession =
            await this.postgresSessionRepository.findByDeviceIdNonDeleted(
                dto.deviceId,
            );

        if (!foundSession) {
            throw UnauthorizedDomainException.create('Session not found');
        }

        if (foundSession.iat !== dto.iat) {
            throw UnauthorizedDomainException.create('Session expired');
        }

        const updatedAccessToken = this.accessTokenContext.sign({
            id: dto.userId,
        });

        const updatedRefreshToken = this.refreshTokenContext.sign({
            userId: dto.userId,
            deviceId: dto.deviceId,
        });

        const decodedIssuedToken =
            this.refreshTokenContext.decode(updatedRefreshToken);

        await this.postgresSessionRepository.updateSession({
            deviceId: dto.deviceId,
            ip: dto.ip,
            iat: decodedIssuedToken.iat!,
            exp: decodedIssuedToken.exp!,
        });
        return {
            accessToken: updatedAccessToken,
            refreshToken: updatedRefreshToken,
        };
    }
}
