import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../../domain/blog.entity';
import { NotFoundDomainException } from '../../../../core/exceptions';

export class BlogsRepository {
    constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

    async save(blog: BlogDocument) {
        return blog.save();
    }

    async findById(id: string): Promise<BlogDocument | null> {
        return this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByIdOrNotFoundFail(id: string): Promise<BlogDocument> {
        const blog = await this.findById(id);

        if (!blog) {
            throw NotFoundDomainException.create('Blog not found');
        }

        return blog;
    }

    async findByIdNonDeletedOrNotFoundFail(id: string): Promise<BlogDocument> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!blog) {
            throw NotFoundDomainException.create('Blog not found');
        }
        return blog;
    }
}
