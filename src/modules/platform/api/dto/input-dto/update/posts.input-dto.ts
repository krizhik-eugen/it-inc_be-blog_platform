import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation/is-string-with-trim';
import { IsObjectId } from '../../../../../../core/decorators/validation/is-object-id';
import { postConstraints } from '../../../../domain/post.entity';
import { UpdatePostDto } from '../../../../dto/update/update-post.dto';

export class UpdatePostInputDto implements UpdatePostDto {
    @ApiPropertyOptional({
        maxLength: postConstraints.title.maxLength,
    })
    @IsStringWithTrim(1, postConstraints.title.maxLength)
    @IsOptional()
    title: string;

    @ApiProperty({
        maxLength: postConstraints.shortDescription.maxLength,
    })
    @IsStringWithTrim(1, postConstraints.shortDescription.maxLength)
    shortDescription: string;

    @ApiPropertyOptional({
        maxLength: postConstraints.content.maxLength,
    })
    @IsStringWithTrim(1, postConstraints.content.maxLength)
    @IsOptional()
    content: string;

    @ApiProperty()
    @IsObjectId()
    blogId: string;
}
