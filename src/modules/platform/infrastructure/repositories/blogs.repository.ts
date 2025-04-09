import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { BlogEntity } from '../../domain/blog.entity';
import { CreateBlogDomainDto } from '../../domain/dto/create';
import { UpdateBlogDomainDto } from '../../domain/dto/update';

@Injectable()
export class BlogsRepository {
    constructor(
        @InjectRepository(BlogEntity)
        private blogsRepo: Repository<BlogEntity>,
    ) {}

    async findById(id: number): Promise<BlogEntity | null> {
        return this.blogsRepo.findOne({ where: { id } });
    }

    async findByIdOrNotFoundFail(id: number): Promise<BlogEntity> {
        const blog = await this.findById(id);

        if (!blog) {
            throw NotFoundDomainException.create('Blog not found');
        }

        return blog;
    }

    async findByIdNonDeleted(id: number): Promise<BlogEntity | null> {
        return this.blogsRepo.findOne({
            where: { id, deleted_at: IsNull() },
        });
    }

    async findByIdNonDeletedOrNotFoundFail(id: number): Promise<BlogEntity> {
        const blog = await this.findByIdNonDeleted(id);

        if (!blog) {
            throw NotFoundDomainException.create('Blog not found');
        }

        return blog;
    }

    async addNewBlog(newBlogDto: CreateBlogDomainDto): Promise<number> {
        const newBlog = this.blogsRepo.create({
            name: newBlogDto.name,
            description: newBlogDto.description,
            website_url: newBlogDto.websiteUrl,
        });

        await this.blogsRepo.save(newBlog);

        return newBlog.id;
    }

    async updateBlog(
        id: number,
        updateBlogDto: UpdateBlogDomainDto,
    ): Promise<void> {
        const blog = await this.findByIdNonDeletedOrNotFoundFail(id);

        // let query = `
        //     UPDATE public.blogs
        //     SET
        // `;

        // const params: (string | number)[] = [];
        // let paramIndex = 1;
        // let hasUpdates = false;

        // if (blog.name) {
        //     query += `name = $${paramIndex}`;
        //     params.push(blog.name);
        //     paramIndex++;
        //     hasUpdates = true;
        // }

        // if (blog.description) {
        //     if (hasUpdates) {
        //         query += `, `;
        //     }
        //     query += `description = $${paramIndex}`;
        //     params.push(blog.description);
        //     paramIndex++;
        //     hasUpdates = true;
        // }

        // if (blog.websiteUrl) {
        //     if (hasUpdates) {
        //         query += `, `;
        //     }
        //     query += `website_url = $${paramIndex}`;
        //     params.push(blog.websiteUrl);
        //     paramIndex++;
        //     hasUpdates = true;
        // }

        // query += ` WHERE id = $${paramIndex}`;
        // params.push(id);

        // if (hasUpdates) {
        //     await this.dataSource.query(query, params);
        // }

        const updatedBlog = { ...blog };

        if (updateBlogDto.name) {
            updatedBlog.name = updateBlogDto.name;
        }

        if (updateBlogDto.description) {
            updatedBlog.description = updateBlogDto.description;
        }

        if (updateBlogDto.websiteUrl) {
            updatedBlog.website_url = updateBlogDto.websiteUrl;
        }

        const updatedBlogEntity = this.blogsRepo.create(updatedBlog);

        await this.blogsRepo.save(updatedBlogEntity);
    }

    async makeBlogDeletedById(id: number): Promise<void> {
        const blog = await this.findByIdOrNotFoundFail(id);
        if (blog.deleted_at) {
            throw NotFoundDomainException.create('Entity is already deleted');
        }
        await this.blogsRepo.softDelete(id);
    }
}
