import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';
import { CreateCommentDto } from '../../../../dto/create';
import { commentConstraints } from '../../../../domain/comment.entity';

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
