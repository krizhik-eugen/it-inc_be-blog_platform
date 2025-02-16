import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/queryRepositories/comments.query-repository';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation-transformation-pipe.service';
import {
    DeleteCommentApi,
    GetCommentApi,
    UpdateCommentApi,
    UpdateCommentLikeStatusApi,
} from './swagger/comments.decorators';
import { JwtAuthGuard } from '../../accounts/guards/bearer/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../application/use-cases/comments/delete-comment.use-case';
import { ExtractUserFromRequest } from '../../accounts/guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../../accounts/guards/dto/user-context.dto';
import { UpdateCommentCommand } from '../application/use-cases/comments/update-comment.use-case';
import { UpdateLikeInputDto } from './dto/input-dto/update/likes.input-dto';
import { UpdateCommentInputDto } from './dto/input-dto/update/comments.input-dto';
import { UpdateCommentLikeStatusCommand } from '../application/use-cases/comments/update-comment-like-status.use-case';
import { JwtOptionalAuthGuard } from 'src/modules/accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../accounts/guards/decorators/extract-user-if-exists-from-request.decorator';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private commandBus: CommandBus,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Put(':commentId/like-status')
    @UpdateCommentLikeStatusApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCommentLikeStatus(
        @Param('commentId', ObjectIdValidationPipe) commentId: string,
        @Body() body: UpdateLikeInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<void> {
        return await this.commandBus.execute<
            UpdateCommentLikeStatusCommand,
            void
        >(new UpdateCommentLikeStatusCommand(commentId, body, user.id));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':commentId')
    @UpdateCommentApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateComment(
        @Param('commentId', ObjectIdValidationPipe) commentId: string,
        @Body() body: UpdateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<void> {
        return await this.commandBus.execute<UpdateCommentCommand, void>(
            new UpdateCommentCommand(commentId, body, user.id),
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':commentId')
    @DeleteCommentApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(
        @Param('commentId', ObjectIdValidationPipe) commentId: string,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<void> {
        return await this.commandBus.execute<DeleteCommentCommand, void>(
            new DeleteCommentCommand(commentId, user.id),
        );
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':commentId')
    @GetCommentApi()
    async getComment(
        @Param('commentId', ObjectIdValidationPipe) commentId: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<CommentViewDto> {
        return await this.commentsQueryRepository.getByIdOrNotFoundFail({
            commentId,
            userId: user?.id,
        });
    }
}
