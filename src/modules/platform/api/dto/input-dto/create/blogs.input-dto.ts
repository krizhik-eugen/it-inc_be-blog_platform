import { ApiProperty } from '@nestjs/swagger';
import { CreateBlogDto } from '../../../../dto/create/create-blog.dto';
import { blogConstraints } from '../../../../domain/blog.entity';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';
import { Matches } from 'class-validator';

export class CreateBlogInputDto implements CreateBlogDto {
    @ApiProperty({
        maxLength: blogConstraints.name.maxLength,
        required: true,
    })
    @IsStringWithTrim(1, blogConstraints.name.maxLength)
    name: string;

    @ApiProperty({
        maxLength: blogConstraints.description.maxLength,
        required: true,
    })
    @IsStringWithTrim(1, blogConstraints.description.maxLength)
    description: string;

    @ApiProperty({
        maxLength: blogConstraints.websiteUrl.maxLength,
        pattern: String(blogConstraints.websiteUrl.pattern),
        required: true,
    })
    @Matches(blogConstraints.websiteUrl.pattern)
    @IsStringWithTrim(1, blogConstraints.websiteUrl.maxLength)
    websiteUrl: string;
}
