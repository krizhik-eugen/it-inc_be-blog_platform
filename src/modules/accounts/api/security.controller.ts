import {
    Controller,
    Delete,
    Get,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
    Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { ExtractSessionDataFromRequest } from '../guards/decorators';
import { SessionViewDto } from './dto/view-dto';
import { GetSessionsQuery } from '../application/queries/security';
import { SessionContextDto } from '../guards/dto';
import { RefreshTokenAuthGuard } from '../guards/bearer';
import {
    DeleteAllSessionsApi,
    DeleteSessionApi,
    GetSessionsApi,
} from './swagger';
import {
    DeleteAllSessionsCommand,
    DeleteSessionCommand,
} from '../application/use-cases/security';

@UseGuards(RefreshTokenAuthGuard)
@Controller('security/devices')
export class SessionsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @Get()
    @GetSessionsApi()
    async getAllSessionDevices(
        @ExtractSessionDataFromRequest() session: SessionContextDto,
    ): Promise<SessionViewDto[]> {
        return this.queryBus.execute<GetSessionsQuery, SessionViewDto[]>(
            new GetSessionsQuery(session.userId),
        );
    }

    @Delete()
    @DeleteAllSessionsApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAllSessions(
        @ExtractSessionDataFromRequest() session: SessionContextDto,
    ): Promise<void> {
        return this.commandBus.execute<DeleteAllSessionsCommand, void>(
            new DeleteAllSessionsCommand(session),
        );
    }

    @Delete(':deviceId')
    @DeleteSessionApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteSession(
        @Res({ passthrough: true }) response: Response,
        @Param('deviceId') deviceId: string,
        @ExtractSessionDataFromRequest() session: SessionContextDto,
    ): Promise<void> {
        await this.commandBus.execute<DeleteSessionCommand, void>(
            new DeleteSessionCommand(deviceId, session),
        );

        if (deviceId === session.deviceId) {
            response.clearCookie('refreshToken');
        }
    }
}
