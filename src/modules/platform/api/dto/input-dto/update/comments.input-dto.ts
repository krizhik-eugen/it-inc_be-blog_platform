import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';
import { UpdateCommentDto } from '../../../../dto/update';
import { commentConstraints } from '../../../../domain/comment.entity';

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
