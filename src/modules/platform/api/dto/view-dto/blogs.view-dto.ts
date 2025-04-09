import { ApiProperty } from '@nestjs/swagger';
import { PaginatedViewDto } from '../../../../../core/dto';
import { BlogEntity } from '../../../domain/blog.entity';

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

    static mapToView(blog: BlogEntity): BlogViewDto {
        const dto = new BlogViewDto();

        dto.id = blog.id.toString();
        dto.description = blog.description;
        dto.name = blog.name;
        dto.websiteUrl = blog.website_url;
        dto.createdAt = new Date(blog.created_at).toISOString();
        dto.isMembership = blog.is_membership;

        return dto;
    }
}

export class PaginatedBlogsViewDto extends PaginatedViewDto<BlogViewDto[]> {
    @ApiProperty({
        type: [BlogViewDto],
    })
    items: BlogViewDto[];
}
