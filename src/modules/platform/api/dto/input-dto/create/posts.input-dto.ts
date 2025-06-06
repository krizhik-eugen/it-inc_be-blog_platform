import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';
import { BlogIsExistent } from '../../../validation';
import { CreateBlogPostDto } from '../../../../dto/create';
import { postConstraints } from '../../../../domain/post.entity';

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
    // @IsObjectId()
    @BlogIsExistent()
    blogId: number;
}
