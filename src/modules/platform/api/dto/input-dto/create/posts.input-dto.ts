import { ApiProperty } from '@nestjs/swagger';
import {
    IsObjectId,
    IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { postConstraints } from '../../../../domain/post.entity';
import { CreateBlogPostDto } from '../../../../dto/create/create-post.dto';
import { BlogIsExistent } from '../../../validation/blog-is-existent.decorator';

export class CreateBlogPostInputDto implements CreateBlogPostDto {
    @ApiProperty({
        maxLength: postConstraints.title.maxLength,
    })
    @IsStringWithTrim(1, postConstraints.title.maxLength)
    title: string;

    @ApiProperty({ maxLength: postConstraints.shortDescription.maxLength })
    @IsStringWithTrim(1, postConstraints.shortDescription.maxLength)
    shortDescription: string;

    @ApiProperty({
        maxLength: postConstraints.content.maxLength,
    })
    @IsStringWithTrim(1, postConstraints.content.maxLength)
    content: string;
}

export class CreatePostInputDto
    extends CreateBlogPostInputDto
    implements CreateBlogPostDto
{
    @ApiProperty()
    @IsObjectId()
    @BlogIsExistent()
    blogId: string;
}
