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
} from './swagger/comments.decorators';
import { JwtAuthGuard } from '../../accounts/guards/bearer/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../application/use-cases/comments/delete-comment.use-case';
import { ExtractUserFromRequest } from '../../accounts/guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../../accounts/guards/dto/user-context.dto';
import { UpdateCommentCommand } from '../application/use-cases/comments/update-comment.use-case';
import { CreateCommentInputDto } from './dto/input-dto/create/comments.input-dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private commandBus: CommandBus,
    ) {}

    @Get(':commentId')
    @GetCommentApi()
    async getComment(
        @Param('commentId', ObjectIdValidationPipe) commentId: string,
    ): Promise<CommentViewDto> {
        return await this.commentsQueryRepository.getByIdOrNotFoundFail(
            commentId,
            null,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Put(':commentId')
    @UpdateCommentApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateComment(
        @Param('commentId', ObjectIdValidationPipe) commentId: string,
        @Body() body: CreateCommentInputDto,
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
}
