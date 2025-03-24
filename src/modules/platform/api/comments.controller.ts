import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Put,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from '../../../core/pipes';
import {
    JwtAuthGuard,
    JwtOptionalAuthGuard,
} from '../../../modules/accounts/guards/bearer';
import {
    ExtractUserFromRequest,
    ExtractUserIfExistsFromRequest,
} from '../../../modules/accounts/guards/decorators';
import {
    DeleteCommentApi,
    GetCommentApi,
    UpdateCommentApi,
    UpdateCommentLikeStatusApi,
} from './swagger';
import {
    UpdateCommentInputDto,
    UpdateLikeInputDto,
} from './dto/input-dto/update';
import { UserContextDto } from '../../../modules/accounts/guards/dto';

import { GetCommentByIdQuery } from '../application/queries/comments';
import {
    DeleteCommentCommand,
    UpdateCommentCommand,
} from '../application/use-cases/comments';
import { CommentViewDto } from './dto/view-dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    // @UseGuards(JwtAuthGuard)
    // @Put(':commentId/like-status')
    // @UpdateCommentLikeStatusApi()
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async updateCommentLikeStatus(
    //     @Param('commentId', ObjectIdValidationPipe) commentId: string,
    //     @Body() body: UpdateLikeInputDto,
    //     @ExtractUserFromRequest() user: UserContextDto,
    // ): Promise<void> {
    //     return this.commandBus.execute<UpdateCommentLikeStatusCommand, void>(
    //         new UpdateCommentLikeStatusCommand(commentId, body, user.id),
    //     );
    // }

    @UseGuards(JwtAuthGuard)
    @Put(':commentId')
    @UpdateCommentApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() body: UpdateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<void> {
        return this.commandBus.execute<UpdateCommentCommand, void>(
            new UpdateCommentCommand(commentId, body, user.id),
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':commentId')
    @DeleteCommentApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<void> {
        return this.commandBus.execute<DeleteCommentCommand, void>(
            new DeleteCommentCommand(commentId, user.id),
        );
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':commentId')
    @GetCommentApi()
    async getComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<CommentViewDto> {
        return this.queryBus.execute<GetCommentByIdQuery, CommentViewDto>(
            new GetCommentByIdQuery(commentId, user?.id),
        );
    }
}
