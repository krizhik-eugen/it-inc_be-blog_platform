import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';
import { UpdatePostDto } from '../../../../dto/update';
import { postConstraints } from '../../../../domain/post.entity';

export class UpdatePostInputDto implements UpdatePostDto {
    @ApiPropertyOptional({
        maxLength: postConstraints.title.maxLength,
    })
    @IsStringWithTrim(1, postConstraints.title.maxLength)
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
    content: string;

    // TODO: removed it here for sa controller
    // @ApiProperty()
    // @IsInt()
    // @BlogIsExistent()
    // blogId: number;
}
