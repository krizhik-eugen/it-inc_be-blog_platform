import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { CreateBlogDto } from '../dto/create/create-blog.dto';
import { BlogsRepository } from '../infrastructure/repositories/blogs.repository';
import { UpdateBlogDto } from '../dto/update/update-blog.dto';

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
        private blogsRepository: BlogsRepository,
    ) {}

    async createBlog(dto: CreateBlogDto): Promise<string> {
        const blog = this.BlogModel.createInstance(dto);

        await this.blogsRepository.save(blog);

        return blog._id.toString();
    }

    async updateBlog(id: string, dto: UpdateBlogDto) {
        const blog =
            await this.blogsRepository.findNonDeletedOrNotFoundFail(id);

        blog.update(dto);
        return await this.blogsRepository.save(blog);
    }

    async deleteBlog(id: string) {
        const blog =
            await this.blogsRepository.findNonDeletedOrNotFoundFail(id);

        blog.makeDeleted();

        return await this.blogsRepository.save(blog);
    }
}
