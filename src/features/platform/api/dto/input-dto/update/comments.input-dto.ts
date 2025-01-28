import { ApiProperty } from '@nestjs/swagger';
import { UpdateCommentDto } from '../../../../dto/update/update-comment.dto';
import { commentValidationRules } from '../../../../domain/validation-rules';

export class UpdateCommentInputDto implements UpdateCommentDto {
    @ApiProperty({
        minLength: commentValidationRules.content.minLength,
        maxLength: commentValidationRules.content.maxLength,
    })
    content: string;
}
