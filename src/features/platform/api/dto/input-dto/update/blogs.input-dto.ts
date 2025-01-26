import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateBlogDto } from '../../../../dto/update/update-blog.dto';
import {
    blogDescriptionValidation,
    blogNameValidation,
    blogWebsiteUrlValidation,
} from '../../../../domain/validation-rules';

export class UpdateBlogInputDto implements UpdateBlogDto {
    @ApiPropertyOptional({
        maxLength: blogNameValidation.maxLength,
    })
    name: string;

    @ApiPropertyOptional({ maxLength: blogDescriptionValidation.maxLength })
    description: string;

    @ApiPropertyOptional({
        pattern: String(blogWebsiteUrlValidation.pattern),
        example: 'https://example.com',
    })
    websiteUrl: string;
}
