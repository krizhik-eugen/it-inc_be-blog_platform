import { ApiProperty } from '@nestjs/swagger';
import { CreateBlogDto } from '../../../../dto/create/create-blog.dto';
import {
    blogDescriptionValidation,
    blogNameValidation,
    blogWebsiteUrlValidation,
} from '../../../../domain/validation-rules';

export class CreateBlogInputDto implements CreateBlogDto {
    @ApiProperty({
        maxLength: blogNameValidation.maxLength,
    })
    name: string;

    @ApiProperty({ maxLength: blogDescriptionValidation.maxLength })
    description: string;

    @ApiProperty({
        maxLength: blogWebsiteUrlValidation.maxLength,
        pattern: String(blogWebsiteUrlValidation.pattern),
    })
    websiteUrl: string;
}
