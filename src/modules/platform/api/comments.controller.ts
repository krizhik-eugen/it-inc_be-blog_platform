import { Controller, Get, Param } from '@nestjs/common';
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infrastructure/queryRepositories/comments.query-repository';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation-transformation-pipe.service';

@Controller('comments')
export class CommentsController {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    @Get(':id')
    @ApiOperation({
        summary: 'Returns comment by id',
    })
    @ApiOkResponse({
        description: 'Success',
        type: CommentViewDto,
    })
    @ApiNotFoundResponse({
        description: 'Not found',
    })
    @ApiParam({
        name: 'id',
    })
    async getComment(
        @Param('id', ObjectIdValidationPipe) id: string,
    ): Promise<CommentViewDto> {
        return await this.commentsQueryRepository.getByIdOrNotFoundFail(
            id,
            null,
        );
    }
}
