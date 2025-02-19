import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
    IsObjectId,
    IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { UpdatePostDto } from '../../../../dto/update';
import { BlogIsExistent } from '../../../validation';
import { postConstraints } from '../../../../domain/post.entity';

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
    @BlogIsExistent()
    blogId: string;
}
