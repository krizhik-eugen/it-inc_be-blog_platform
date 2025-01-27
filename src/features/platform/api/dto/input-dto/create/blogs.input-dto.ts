import { ApiProperty } from '@nestjs/swagger';
import { CreateBlogDto } from '../../../../dto/create/create-blog.dto';
import { blogValidationRules } from '../../../../domain/validation-rules';

export class CreateBlogInputDto implements CreateBlogDto {
    @ApiProperty({
        maxLength: blogValidationRules.name.maxLength,
    })
    name: string;

    @ApiProperty({ maxLength: blogValidationRules.description.maxLength })
    description: string;

    @ApiProperty({
        maxLength: blogValidationRules.websiteUrl.maxLength,
        pattern: String(blogValidationRules.websiteUrl.pattern),
    })
    websiteUrl: string;
}
