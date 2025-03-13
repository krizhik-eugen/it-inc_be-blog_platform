import { ApiProperty } from '@nestjs/swagger';
import { MongoBlogDocument } from '../../../domain/blog.entity';
import { PaginatedViewDto } from '../../../../../core/dto';
import { PostgresBlog } from '../../../domain/blog.postgres-entity';

export class MongoBlogViewDto {
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

    static mapToView(blog: MongoBlogDocument): MongoBlogViewDto {
        const dto = new MongoBlogViewDto();

        dto.id = blog._id.toString();
        dto.description = blog.description;
        dto.name = blog.name;
        dto.websiteUrl = blog.websiteUrl;
        dto.createdAt = blog.createdAt;
        dto.isMembership = blog.isMembership;

        return dto;
    }
}

export class PaginatedMongoBlogsViewDto extends PaginatedViewDto<
    MongoBlogViewDto[]
> {
    @ApiProperty({
        type: [MongoBlogViewDto],
    })
    items: MongoBlogViewDto[];
}

export class PostgresBlogViewDto {
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

    static mapToView(blog: PostgresBlog): PostgresBlogViewDto {
        const dto = new PostgresBlogViewDto();

        dto.id = blog.id.toString();
        dto.description = blog.description;
        dto.name = blog.name;
        dto.websiteUrl = blog.website_url;
        dto.createdAt = new Date(blog.created_at).toISOString();
        dto.isMembership = blog.is_membership;

        return dto;
    }
}

export class PaginatedPostgresBlogsViewDto extends PaginatedViewDto<
    PostgresBlogViewDto[]
> {
    @ApiProperty({
        type: [PostgresBlogViewDto],
    })
    items: PostgresBlogViewDto[];
}
