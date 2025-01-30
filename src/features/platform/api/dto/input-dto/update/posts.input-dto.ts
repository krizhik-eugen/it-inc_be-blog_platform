import { ApiPropertyOptional } from '@nestjs/swagger';
import { postValidationRules } from '../../../../domain/validation-rules';
import { UpdatePostDto } from '../../../../dto/update/update-post.dto';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';
import { IsOptional } from 'class-validator';

export class UpdatePostInputDto implements UpdatePostDto {
    @ApiPropertyOptional({
        maxLength: postValidationRules.title.maxLength,
    })
    @IsStringWithTrim(1, postValidationRules.title.maxLength)
    @IsOptional()
    title: string;

    @ApiPropertyOptional({
        maxLength: postValidationRules.shortDescription.maxLength,
    })
    // @IsStringWithTrim(1, postValidationRules.shortDescription.maxLength)
    // @IsOptional()
    shortDescription: string;

    @ApiPropertyOptional({
        maxLength: postValidationRules.content.maxLength,
    })
    // @IsStringWithTrim(1, postValidationRules.content.maxLength)
    // @IsOptional()
    content: string;

    @ApiPropertyOptional()
    //TODO: add validation for objectid
    @IsStringWithTrim()
    @IsOptional()
    blogId: string;
}
