import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../../domain/blog.entity';

export class BlogsRepository {
    constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

    async findById(id: string): Promise<BlogDocument | null> {
        return this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(blog: BlogDocument) {
        return await blog.save();
    }

    async findOrNotFoundFail(id: string): Promise<BlogDocument> {
        const blog = await this.findById(id);

        if (!blog) {
            throw new NotFoundException('blog not found');
        }

        return blog;
    }

    async findNonDeletedOrNotFoundFail(id: string): Promise<BlogDocument> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!blog) {
            throw new NotFoundException('blog not found');
        }
        return blog;
    }
}
