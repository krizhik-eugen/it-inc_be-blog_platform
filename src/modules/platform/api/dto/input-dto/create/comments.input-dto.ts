import { ApiProperty } from '@nestjs/swagger';
import { CreateCommentDto } from '../../../../dto/create/create-comment.dto';
import { commentConstraints } from '../../../../domain/comment.entity';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';

export class CreateCommentInputDto implements CreateCommentDto {
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
