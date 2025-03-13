import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto';
import { GetBlogsQueryParams } from '../../api/dto/query-params-dto';
import { MongoBlog, MongoBlogModelType } from '../../domain/blog.entity';
import { MongoBlogViewDto } from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';

export class MongoBlogsQueryRepository {
    constructor(
        @InjectModel(MongoBlog.name)
        private BlogModel: MongoBlogModelType,
    ) {}

    async getByIdOrNotFoundFail(blogId: string): Promise<MongoBlogViewDto> {
        const blog = await this.BlogModel.findOne({
            _id: blogId,
            deletedAt: null,
        }).exec();

        if (!blog) {
            throw NotFoundDomainException.create('MongoBlog not found');
        }

        return MongoBlogViewDto.mapToView(blog);
    }

    async getAllBlogs(
        query: GetBlogsQueryParams,
    ): Promise<PaginatedViewDto<MongoBlogViewDto[]>> {
        const findQuery: FilterQuery<MongoBlog> = { deletedAt: null };
        const searchConditions: FilterQuery<MongoBlog>[] = [];

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

        const mappedBlogs = result.map((blog) =>
            MongoBlogViewDto.mapToView(blog),
        );

        return PaginatedViewDto.mapToView({
            items: mappedBlogs,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: blogsCount,
        });
    }
}
