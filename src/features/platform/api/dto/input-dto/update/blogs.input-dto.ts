import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateBlogDto } from '../../../../dto/update/update-blog.dto';
import { blogValidationRules } from '../../../../domain/validation-rules';

export class UpdateBlogInputDto implements UpdateBlogDto {
    @ApiPropertyOptional({
        maxLength: blogValidationRules.name.maxLength,
    })
    name: string;

    @ApiPropertyOptional({
        maxLength: blogValidationRules.description.maxLength,
    })
    description: string;

    @ApiPropertyOptional({
        pattern: String(blogValidationRules.websiteUrl.pattern),
        example: 'https://example.com',
    })
    websiteUrl: string;
}
