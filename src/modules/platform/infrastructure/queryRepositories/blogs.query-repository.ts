import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { PaginatedBlogsViewDto, BlogViewDto } from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { BlogEntity } from '../../domain/blog.entity';
import {
    BlogsSortBy,
    GetBlogsQueryParams,
} from '../../api/dto/query-params-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogsQueryRepository {
    constructor(
        @InjectRepository(BlogEntity)
        private blogsRepo: Repository<BlogEntity>,
    ) {}

    async getByIdOrNotFoundFail(id: number): Promise<BlogViewDto> {
        const data = await this.blogsRepo.findOne({
            where: { id, deleted_at: IsNull() },
        });

        if (!data) {
            throw NotFoundDomainException.create('Blog not found');
        }

        return BlogViewDto.mapToView(data);
    }

    // async getAllBlogs(
    //     query: GetBlogsQueryParams,
    // ): Promise<PaginatedBlogsViewDto> {
    //     const queryParams: (string | number)[] = [];
    //     let paramIndex = 1;

    //     const searchNameTerm = query.searchNameTerm
    //         ? query.searchNameTerm
    //         : null;

    //     let filterCondition = `deleted_at IS NULL`;

    //     if (searchNameTerm) {
    //         filterCondition += ` AND name ILIKE $${paramIndex}`;
    //         queryParams.push(`%${searchNameTerm}%`);
    //         paramIndex++;
    //     }

    //     const sqlQuery = `
    //         SELECT b.*, COUNT(*) OVER() as total_count
    //         FROM public.blogs b
    //         WHERE ${filterCondition}
    //         ORDER BY ${this.sanitizeSortField(query.sortBy)} ${query.sortDirection}
    //         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    //     `;

    //     queryParams.push(query.pageSize, query.calculateSkip());

    //     const data = await this.dataSource.query<
    //         (BlogEntity & { total_count: string })[]
    //     >(sqlQuery, queryParams);

    //     const totalCount = data.length ? parseInt(data[0].total_count) : 0;

    //     const mappedBlogs = data.map((blog) => BlogViewDto.mapToView(blog));

    //     return PaginatedBlogsViewDto.mapToView({
    //         items: mappedBlogs,
    //         page: query.pageNumber,
    //         size: query.pageSize,
    //         totalCount: totalCount,
    //     });
    // }

    async getAllBlogs(
        query: GetBlogsQueryParams,
    ): Promise<PaginatedBlogsViewDto> {
        const searchNameTerm = query.searchNameTerm
            ? query.searchNameTerm
            : null;

        const qb = this.blogsRepo
            .createQueryBuilder('blogs')
            .where('blogs.deleted_at IS NULL');

        if (searchNameTerm) {
            qb.andWhere('blogs.name ILIKE :nameTerm', {
                nameTerm: `%${searchNameTerm}%`,
            });
        }

        const sortBy = this.sanitizeSortField(query.sortBy);

        qb.orderBy(
            `blogs.${sortBy}`,
            query.sortDirection.toUpperCase() as 'ASC' | 'DESC',
        );

        qb.skip(query.calculateSkip()).take(query.pageSize);

        const [blogs, totalCount] = await qb.getManyAndCount();

        const mappedBlogs = blogs.map((blog) => BlogViewDto.mapToView(blog));

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
