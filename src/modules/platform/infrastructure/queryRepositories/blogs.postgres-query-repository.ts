import { DataSource } from 'typeorm';
import {
    PaginatedPostgresBlogsViewDto,
    PostgresBlogViewDto,
} from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { PostgresBlog } from '../../domain/blog.postgres-entity';
import { GetBlogsQueryParams } from '../../api/dto/query-params-dto';

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
        const queryParams: string[] = [];
        let paramCounter = 1;

        const searchNameTerm = query.searchNameTerm
            ? query.searchNameTerm
            : null;

        let filterCondition = `deleted_at IS NULL`;

        if (searchNameTerm) {
            filterCondition += ` AND name ILIKE $${paramCounter}`;
            queryParams.push(`%${searchNameTerm}%`);
            paramCounter++;
        }

        const sqlQuery = `
            SELECT b.*, COUNT(*) OVER() as total_count 
            FROM public.blogs b
            WHERE ${filterCondition}
            ORDER BY ${query.sortBy} ${query.sortDirection}
            LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
        `;

        queryParams.push(
            query.pageSize.toString(),
            query.calculateSkip().toString(),
        );

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
}
