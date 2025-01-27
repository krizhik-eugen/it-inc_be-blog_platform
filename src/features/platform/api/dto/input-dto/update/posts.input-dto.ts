import { ApiPropertyOptional } from '@nestjs/swagger';
import { postValidationRules } from '../../../../domain/validation-rules';
import { UpdatePostDto } from '../../../../dto/update/update-post.dto';

export class UpdatePostInputDto implements UpdatePostDto {
    @ApiPropertyOptional({
        maxLength: postValidationRules.title.maxLength,
    })
    title: string;

    @ApiPropertyOptional({
        maxLength: postValidationRules.shortDescription.maxLength,
    })
    shortDescription: string;

    @ApiPropertyOptional({
        maxLength: postValidationRules.content.maxLength,
    })
    content: string;

    @ApiPropertyOptional()
    blogId: string;
}
