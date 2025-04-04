import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';
import { UpdateBlogDto } from '../../../../dto/update';
import { blogConstraints } from '../../../../domain/blog.entity';

export class UpdateBlogInputDto implements UpdateBlogDto {
    @ApiPropertyOptional({
        maxLength: blogConstraints.name.maxLength,
    })
    @IsStringWithTrim(1, blogConstraints.name.maxLength)
    name: string;

    @ApiPropertyOptional({
        maxLength: blogConstraints.description.maxLength,
    })
    @IsStringWithTrim(1, blogConstraints.description.maxLength)
    @IsOptional()
    description: string;

    @ApiPropertyOptional({
        maxLength: blogConstraints.websiteUrl.maxLength,
        pattern: String(blogConstraints.websiteUrl.pattern),
    })
    @Matches(blogConstraints.websiteUrl.pattern)
    @IsStringWithTrim(1, blogConstraints.websiteUrl.maxLength)
    @IsOptional()
    websiteUrl: string;
}
