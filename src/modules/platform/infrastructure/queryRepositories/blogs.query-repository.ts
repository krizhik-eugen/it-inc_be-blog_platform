import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetBlogsQueryParams } from '../../api/dto/query-params-dto/get-blogs-query-params.input-dto';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { BlogViewDto } from '../../api/dto/view-dto/blogs.view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

export class BlogsQueryRepository {
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
    ) {}

    async getByIdOrNotFoundFail(blogId: string): Promise<BlogViewDto> {
        const blog = await this.BlogModel.findOne({
            _id: blogId,
            deletedAt: null,
        }).exec();

        if (!blog) {
            throw NotFoundDomainException.create('Blog not found');
        }

        return BlogViewDto.mapToView(blog);
    }

    async getAllBlogs(
        query: GetBlogsQueryParams,
    ): Promise<PaginatedViewDto<BlogViewDto[]>> {
        const findQuery: FilterQuery<Blog> = { deletedAt: null };
        const searchConditions: FilterQuery<Blog>[] = [];

        if (query.searchNameTerm) {
            searchConditions.push({
                name: { $regex: query.searchNameTerm, $options: 'i' },
            });
        }

        if (searchConditions.length > 0) {
            findQuery.$or = searchConditions;
        }

        const result = await this.BlogModel.find(findQuery)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);

        const blogsCount = await this.BlogModel.countDocuments(findQuery);

        const mappedBlogs = result.map((blog) => BlogViewDto.mapToView(blog));

        return PaginatedViewDto.mapToView({
            items: mappedBlogs,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: blogsCount,
        });
    }
}
