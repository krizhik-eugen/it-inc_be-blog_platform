import { ApiProperty } from '@nestjs/swagger';
import { postValidationRules } from '../../../../domain/validation-rules';
import { CreatePostDto } from '../../../../dto/create/create-post.dto';

export class CreatePostInputDto implements CreatePostDto {
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

    @ApiProperty()
    blogId: string;
}
