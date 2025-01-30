import { ApiProperty } from '@nestjs/swagger';
import { UpdateCommentDto } from '../../../../dto/update/update-comment.dto';
import { commentValidationRules } from '../../../../domain/validation-rules';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';

export class UpdateCommentInputDto implements UpdateCommentDto {
    @ApiProperty({
        minLength: commentValidationRules.content.minLength,
        maxLength: commentValidationRules.content.maxLength,
    })
    @IsStringWithTrim(
        commentValidationRules.content.minLength,
        commentValidationRules.content.maxLength,
    )
    content: string;
}
