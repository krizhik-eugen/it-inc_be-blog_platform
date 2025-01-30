import { ApiProperty } from '@nestjs/swagger';
import { postValidationRules } from '../../../../domain/validation-rules';
import { CreateBlogPostDto } from '../../../../dto/create/create-post.dto';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';

export class CreateBlogPostInputDto implements CreateBlogPostDto {
    @ApiProperty({
        maxLength: postValidationRules.title.maxLength,
    })
    @IsStringWithTrim(1, postValidationRules.title.maxLength)
    title: string;

    @ApiProperty({ maxLength: postValidationRules.shortDescription.maxLength })
    @IsStringWithTrim(1, postValidationRules.shortDescription.maxLength)
    shortDescription: string;

    @ApiProperty({
        maxLength: postValidationRules.content.maxLength,
    })
    @IsStringWithTrim(1, postValidationRules.content.maxLength)
    content: string;
}

export class CreatePostInputDto
    extends CreateBlogPostInputDto
    implements CreateBlogPostDto
{
    @ApiProperty()
    //TODO: add validation for objectid
    // @IsStringWithTrim()
    blogId: string;
}
