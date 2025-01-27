import { ApiProperty } from '@nestjs/swagger';
import { postValidationRules } from '../../../../domain/validation-rules';
import { CreateBlogPostDto } from '../../../../dto/create/create-post.dto';

export class CreateBlogPostInputDto implements CreateBlogPostDto {
    @ApiProperty({
        maxLength: postValidationRules.title.maxLength,
    })
    title: string;

    @ApiProperty({ maxLength: postValidationRules.shortDescription.maxLength })
    shortDescription: string;

    @ApiProperty({
        maxLength: postValidationRules.content.maxLength,
    })
    content: string;
}

export class CreatePostInputDto
    extends CreateBlogPostInputDto
    implements CreateBlogPostDto
{
    @ApiProperty()
    blogId: string;
}
