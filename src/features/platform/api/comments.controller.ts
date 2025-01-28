import { Controller, Get, Param } from '@nestjs/common';
import { HTTP_STATUS_CODES } from '../../../constants';
import { CommentsQueryRepository } from '../infrastructure/queryRepositories/comments.query-repository';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    @Get(':id')
    @ApiOperation({
        summary: 'Returns comment by id',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: CommentViewDto,
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        description: 'Not found',
    })
    async getComment(@Param('id') id: string) {
        return await this.commentsQueryRepository.getByIdOrNotFoundFail(
            id,
            null,
        );
    }
}
