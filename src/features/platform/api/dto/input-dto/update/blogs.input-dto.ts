import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateBlogDto } from '../../../../dto/update/update-blog.dto';
import { blogValidationRules } from '../../../../domain/validation-rules';
import { Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';

export class UpdateBlogInputDto implements UpdateBlogDto {
    @ApiPropertyOptional({
        maxLength: blogValidationRules.name.maxLength,
    })
    @IsStringWithTrim(1, blogValidationRules.name.maxLength)
    name: string;

    @ApiPropertyOptional({
        maxLength: blogValidationRules.description.maxLength,
    })
    @IsStringWithTrim(1, blogValidationRules.description.maxLength)
    description: string;

    @ApiPropertyOptional({
        maxLength: blogValidationRules.websiteUrl.maxLength,
        pattern: String(blogValidationRules.websiteUrl.pattern),
    })
    @Matches(blogValidationRules.websiteUrl.pattern)
    @IsStringWithTrim(1, blogValidationRules.websiteUrl.maxLength)
    websiteUrl: string;
}
