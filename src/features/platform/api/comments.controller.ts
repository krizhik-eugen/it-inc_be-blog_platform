import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
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
        status: HttpStatus.OK,
        description: 'Success',
        type: CommentViewDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found',
    })
    async getComment(@Param('id') id: string) {
        return await this.commentsQueryRepository.getByIdOrNotFoundFail(
            id,
            null,
        );
    }
}
