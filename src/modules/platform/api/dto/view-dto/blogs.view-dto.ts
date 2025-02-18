import { ApiProperty } from '@nestjs/swagger';
import { BlogDocument } from '../../../domain/blog.entity';
import { PaginatedViewDto } from '../../../../../core/dto';

export class BlogViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    websiteUrl: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty({
        description:
            'True if user has not expired membership subscription to blog',
    })
    isMembership: boolean;

    static mapToView(blog: BlogDocument): BlogViewDto {
        const dto = new BlogViewDto();

        dto.id = blog._id.toString();
        dto.description = blog.description;
        dto.name = blog.name;
        dto.websiteUrl = blog.websiteUrl;
        dto.createdAt = blog.createdAt;
        dto.isMembership = blog.isMembership;

        return dto;
    }
}

export class PaginatedBlogsViewDto extends PaginatedViewDto<BlogViewDto[]> {
    @ApiProperty({
        type: [BlogViewDto],
    })
    items: BlogViewDto[];
}
