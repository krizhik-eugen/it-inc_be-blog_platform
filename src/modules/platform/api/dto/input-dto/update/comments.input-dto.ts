import { ApiProperty } from '@nestjs/swagger';
import { UpdateCommentDto } from '../../../../dto/update/update-comment.dto';
import { commentConstraints } from '../../../../domain/comment.entity';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';

export class UpdateCommentInputDto implements UpdateCommentDto {
    @ApiProperty({
        minLength: commentConstraints.content.minLength,
        maxLength: commentConstraints.content.maxLength,
    })
    @IsStringWithTrim(
        commentConstraints.content.minLength,
        commentConstraints.content.maxLength,
    )
    content: string;
}
