import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaginatedBlogsViewDto, BlogViewDto } from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { Blog } from '../../domain/blog.entity';
import {
    BlogsSortBy,
    GetBlogsQueryParams,
} from '../../api/dto/query-params-dto';

@Injectable()
export class BlogsQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getByIdOrNotFoundFail(id: number): Promise<BlogViewDto> {
        const data: Blog[] = await this.dataSource.query(
            `
                SELECT * FROM public.blogs
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        if (!data.length) {
            throw NotFoundDomainException.create('Blog not found');
        }

        return BlogViewDto.mapToView(data[0]);
    }

    async getAllBlogs(
        query: GetBlogsQueryParams,
    ): Promise<PaginatedBlogsViewDto> {
        const queryParams: (string | number)[] = [];
        let paramIndex = 1;

        const searchNameTerm = query.searchNameTerm
            ? query.searchNameTerm
            : null;

        let filterCondition = `deleted_at IS NULL`;

        if (searchNameTerm) {
            filterCondition += ` AND name ILIKE $${paramIndex}`;
            queryParams.push(`%${searchNameTerm}%`);
            paramIndex++;
        }

        const sqlQuery = `
            SELECT b.*, COUNT(*) OVER() as total_count 
            FROM public.blogs b
            WHERE ${filterCondition}
            ORDER BY ${this.sanitizeSortField(query.sortBy)} ${query.sortDirection}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        queryParams.push(query.pageSize, query.calculateSkip());

        const data = await this.dataSource.query<
            (Blog & { total_count: string })[]
        >(sqlQuery, queryParams);

        const totalCount = data.length ? parseInt(data[0].total_count) : 0;

        const mappedBlogs = data.map((blog) => BlogViewDto.mapToView(blog));

        return PaginatedBlogsViewDto.mapToView({
            items: mappedBlogs,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: totalCount,
        });
    }

    private sanitizeSortField(field: BlogsSortBy): 'name' | 'created_at' {
        switch (field) {
            case BlogsSortBy.Name:
                return 'name';
            case BlogsSortBy.CreatedAt:
                return 'created_at';
            default:
                return 'created_at';
        }
    }
}
