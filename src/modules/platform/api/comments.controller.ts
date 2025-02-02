import { Controller, Get, Param } from '@nestjs/common';
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';
import { CommentsQueryRepository } from '../infrastructure/queryRepositories/comments.query-repository';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';

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
    async getComment(@Param('id', ObjectIdValidationPipe) id: string) {
        return await this.commentsQueryRepository.getByIdOrNotFoundFail(
            id,
            null,
        );
    }
}
