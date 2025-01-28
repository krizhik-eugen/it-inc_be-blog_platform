import { ApiProperty } from '@nestjs/swagger';
import { CreateCommentDto } from '../../../../dto/create/create-comment.dto';
import { commentValidationRules } from '../../../../domain/validation-rules';

export class CreateCommentInputDto implements CreateCommentDto {
    @ApiProperty({
        minLength: commentValidationRules.content.minLength,
        maxLength: commentValidationRules.content.maxLength,
    })
    content: string;
}
