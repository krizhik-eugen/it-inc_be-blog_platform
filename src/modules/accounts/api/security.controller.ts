import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Ip,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    Headers,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from '../../../core/pipes';
import { ExtractSessionDataFromRequest, Public } from '../guards/decorators';
import { BasicAuthGuard } from '../guards/basic';
import { SessionViewDto } from './dto/view-dto/sessions.view-dto';
import { GetSessionsQuery } from '../application/queries/security';
import { RefreshTokenAuthGuard } from '../guards/bearer';
import { SessionContextDto } from '../guards/dto/session-context.dto';

@Controller('security')
// @UseGuards(BasicAuthGuard)
export class SessionsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(RefreshTokenAuthGuard)
    @Get()
    // @GetSessionsApi()
    async getAllSessionDevices(
        @ExtractSessionDataFromRequest() session: SessionContextDto,
    ): Promise<SessionViewDto[]> {
        return this.queryBus.execute<GetSessionsQuery, SessionViewDto[]>(
            new GetSessionsQuery(session.userId),
        );
    }

    // @Post()
    // @CreateSessionApi()
    // async createSession(@Body() body: CreateSessionInputDto): Promise<SessionViewDto> {
    //     const newSessionId = await this.commandBus.execute<
    //         CreateSessionCommand,
    //         string
    //     >(
    //         new CreateSessionCommand({
    //             email: body.email,
    //             login: body.login,
    //             password: body.password,
    //         }),
    //     );
    //     return this.queryBus.execute<GetSessionByIdQuery, SessionViewDto>(
    //         new GetSessionByIdQuery(newSessionId),
    //     );
    // }

    // @Put(':sessionId')
    // @UpdateSessionApi()
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async updateSession(
    //     @Param('sessionId', ObjectIdValidationPipe) sessionId: string,
    //     @Body() body: UpdateSessionInputDto,
    // ): Promise<void> {
    //     return this.commandBus.execute<UpdateSessionCommand, void>(
    //         new UpdateSessionCommand(sessionId, {
    //             email: body.email,
    //         }),
    //     );
    // }

    // @Delete(':sessionId')
    // @DeleteSessionApi()
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async deleteSession(
    //     @Param('sessionId', ObjectIdValidationPipe) sessionId: string,
    // ): Promise<void> {
    //     return this.commandBus.execute<DeleteSessionCommand, void>(
    //         new DeleteSessionCommand(sessionId),
    //     );
    // }
}
