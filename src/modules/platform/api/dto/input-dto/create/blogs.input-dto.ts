import { ApiProperty } from '@nestjs/swagger';
import { CreateBlogDto } from '../../../../dto/create/create-blog.dto';
import { blogValidationRules } from '../../../../domain/validation-rules';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';
import { Matches } from 'class-validator';

export class CreateBlogInputDto implements CreateBlogDto {
    @ApiProperty({
        maxLength: blogValidationRules.name.maxLength,
        required: true,
    })
    @IsStringWithTrim(1, blogValidationRules.name.maxLength)
    name: string;

    @ApiProperty({
        maxLength: blogValidationRules.description.maxLength,
        required: true,
    })
    @IsStringWithTrim(1, blogValidationRules.description.maxLength)
    description: string;

    @ApiProperty({
        maxLength: blogValidationRules.websiteUrl.maxLength,
        pattern: String(blogValidationRules.websiteUrl.pattern),
        required: true,
    })
    @Matches(blogValidationRules.websiteUrl.pattern)
    @IsStringWithTrim(1, blogValidationRules.websiteUrl.maxLength)
    websiteUrl: string;
}
