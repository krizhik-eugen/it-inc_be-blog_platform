import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { PostgresBlog } from '../../domain/blog.postgres-entity';
import { CreateBlogDomainDto } from '../../domain/dto/create';
import { UpdateBlogDomainDto } from '../../domain/dto/update';

@Injectable()
export class PostgresBlogsRepository {
    constructor(
        // @InjectModel(MongoBlog.name) private BlogModel: MongoBlogModelType,
        private dataSource: DataSource,
    ) {}

    async findById(id: number): Promise<PostgresBlog | null> {
        const data: PostgresBlog[] = await this.dataSource.query(
            `
                SELECT * FROM public.blogs
                WHERE id = $1
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByIdOrNotFoundFail(id: number): Promise<PostgresBlog> {
        const blog = await this.findById(id);

        if (!blog) {
            throw NotFoundDomainException.create('PostgresBlog not found');
        }

        return blog;
    }

    async findByIdNonDeleted(id: number): Promise<PostgresBlog | null> {
        const data: PostgresBlog[] = await this.dataSource.query(
            `
                SELECT * FROM public.blogs
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByIdNonDeletedOrNotFoundFail(id: number): Promise<PostgresBlog> {
        const data: PostgresBlog[] = await this.dataSource.query(
            `
                SELECT * FROM public.blogs
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        if (!data[0]) {
            throw NotFoundDomainException.create('PostgresBlog not found');
        }
        return data[0];
    }

    async addNewBlog(blog: CreateBlogDomainDto): Promise<number> {
        const data: { id: number }[] = await this.dataSource.query(
            `
                INSERT INTO public.blogs (name, description, website_url)
                VALUES ($1, $2, $3)
                RETURNING id    
            `,
            [blog.name, blog.description, blog.websiteUrl],
        );

        return data[0].id;
    }

    async updateBlog(id: number, blog: UpdateBlogDomainDto): Promise<void> {
        await this.findByIdNonDeletedOrNotFoundFail(id);

        let query = `
            UPDATE public.blogs
            SET
        `;

        const params: (string | number)[] = [];
        let paramIndex = 1;
        let hasUpdates = false;

        if (blog.name) {
            query += `name = $${paramIndex}`;
            params.push(blog.name);
            paramIndex++;
            hasUpdates = true;
        }

        if (blog.description) {
            if (hasUpdates) {
                query += `, `;
            }
            query += `description = $${paramIndex}`;
            params.push(blog.description);
            paramIndex++;
            hasUpdates = true;
        }

        if (blog.websiteUrl) {
            if (hasUpdates) {
                query += `, `;
            }
            query += `website_url = $${paramIndex}`;
            params.push(blog.websiteUrl);
            paramIndex++;
            hasUpdates = true;
        }

        query += ` WHERE id = $${paramIndex}`;
        params.push(id);

        if (hasUpdates) {
            await this.dataSource.query(query, params);
        }
    }

    async makeBlogDeletedById(id: number): Promise<void> {
        const blog = await this.findByIdOrNotFoundFail(id);
        if (blog.deleted_at) {
            throw NotFoundDomainException.create('Entity is already deleted');
        }
        await this.dataSource.query(
            `UPDATE public.blogs SET deleted_at = NOW() WHERE id = $1`,
        );
    }
}
