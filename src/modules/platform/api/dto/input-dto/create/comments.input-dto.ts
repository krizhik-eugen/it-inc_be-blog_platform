import { ApiProperty } from '@nestjs/swagger';
import { CreateCommentDto } from '../../../../dto/create/create-comment.dto';
import { commentValidationRules } from '../../../../domain/validation-rules';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';

export class CreateCommentInputDto implements CreateCommentDto {
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
