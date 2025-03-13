import { NotFoundDomainException } from '../../../../core/exceptions';
import { DataSource } from 'typeorm';
import { PostgresBlog } from '../../domain/blog.postgres-entity';
import { CreateBlogDomainDto } from '../../domain/dto/create';
import { UpdateBlogDomainDto } from '../../domain/dto/update';

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

        if (blog.name) {
            query += `name = $1`;
            params.push(blog.name);
        }
        if (blog.description) {
            if (blog.name) {
                query += `, `;
            }
            query += `description = $2`;
            params.push(blog.description);
        }
        if (blog.websiteUrl) {
            if (blog.name || blog.description) {
                query += `, `;
            }
            query += `website_url = $3`;
            params.push(blog.websiteUrl);
        }

        query += `WHERE id = $4`;
        params.push(id);

        await this.dataSource.query(query, params);
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
