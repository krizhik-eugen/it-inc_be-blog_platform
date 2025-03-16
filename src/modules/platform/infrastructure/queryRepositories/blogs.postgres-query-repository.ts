import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
    PaginatedPostgresBlogsViewDto,
    PostgresBlogViewDto,
} from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { PostgresBlog } from '../../domain/blog.postgres-entity';
import { GetBlogsQueryParams } from '../../api/dto/query-params-dto';

@Injectable()
export class PostgresBlogsQueryRepository {
    constructor(
        // @InjectModel(MongoBlog.name)
        // private BlogModel: MongoBlogModelType,
        private dataSource: DataSource,
    ) {}

    async getByIdOrNotFoundFail(id: number): Promise<PostgresBlogViewDto> {
        const data: PostgresBlog[] = await this.dataSource.query(
            `
                SELECT * FROM public.blogs
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        if (!data.length) {
            throw NotFoundDomainException.create('PostgresBlog not found');
        }

        return PostgresBlogViewDto.mapToView(data[0]);
    }

    async getAllBlogs(
        query: GetBlogsQueryParams,
    ): Promise<PaginatedPostgresBlogsViewDto> {
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
            (PostgresBlog & { total_count: string })[]
        >(sqlQuery, queryParams);

        const totalCount = data.length ? parseInt(data[0].total_count) : 0;

        const mappedBlogs = data.map((blog) =>
            PostgresBlogViewDto.mapToView(blog),
        );

        return PaginatedPostgresBlogsViewDto.mapToView({
            items: mappedBlogs,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: totalCount,
        });
    }

    private sanitizeSortField(field: string): string {
        const allowedFields = ['name', 'created_at'];
        if (!allowedFields.includes(field.toLowerCase())) {
            return 'created_at';
        }
        return field;
    }
}
