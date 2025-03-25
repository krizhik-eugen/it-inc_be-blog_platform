import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { Post } from '../../domain/post.entity';
import { CreatePostDomainDto } from '../../domain/dto/create';
import { UpdatePostDomainDto } from '../../domain/dto/update';

@Injectable()
export class PostsRepository {
    constructor(private dataSource: DataSource) {}

    async findById(id: number): Promise<Post | null> {
        const data: Post[] = await this.dataSource.query(
            `
                SELECT * FROM public.posts
                WHERE id = $1
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByIdOrNotFoundFail(id: number): Promise<Post> {
        const post = await this.findById(id);

        if (!post) {
            throw NotFoundDomainException.create('Post not found');
        }

        return post;
    }

    async findByIdNonDeletedOrNotFoundFail(id: number): Promise<Post> {
        const post: Post[] = await this.dataSource.query(
            `
                SELECT * FROM public.posts
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        if (!post[0]) {
            throw NotFoundDomainException.create('Post not found');
        }
        return post[0];
    }

    async findAllByBlogIdNonDeleted(blogId: number): Promise<Post[]> {
        const data: Post[] = await this.dataSource.query(
            `
                SELECT * FROM public.posts
                WHERE blog_id = $1 AND deleted_at IS NULL
                `,
            [blogId],
        );

        return data;
    }

    async addNewPost(post: CreatePostDomainDto): Promise<number> {
        const data: { id: number }[] = await this.dataSource.query(
            `
                INSERT INTO public.posts (title, short_description, content, blog_id, blog_name)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
                `,
            [
                post.title,
                post.shortDescription,
                post.content,
                post.blogId,
                post.blogName,
            ],
        );

        return data[0].id;
    }

    async updatePostById(id: number, dto: UpdatePostDomainDto) {
        await this.findByIdNonDeletedOrNotFoundFail(id);

        let query = `
            UPDATE public.posts
            SET
        `;

        const params: (string | number)[] = [];
        let paramIndex = 1;
        let hasUpdates = false;

        if (dto.title) {
            query += `title = $${paramIndex}`;
            params.push(dto.title);
            paramIndex++;
            hasUpdates = true;
        }

        if (dto.shortDescription) {
            if (hasUpdates) {
                query += `, `;
            }
            query += `short_description = $${paramIndex}`;
            params.push(dto.shortDescription);
            paramIndex++;
            hasUpdates = true;
        }

        if (dto.content) {
            if (hasUpdates) {
                query += `, `;
            }
            query += `content = $${paramIndex}`;
            params.push(dto.content);
            paramIndex++;
            hasUpdates = true;
        }

        query += ` WHERE id = $${paramIndex}`;
        params.push(id);

        if (hasUpdates) {
            await this.dataSource.query(query, params);
        }
    }

    async makeDeletedAllByBlogId(blogId: number): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE public.posts
                SET deleted_at = NOW()
                WHERE blog_id = $1
                `,
            [blogId],
        );
    }

    async makePostDeletedById(id: number): Promise<void> {
        const post = await this.findByIdOrNotFoundFail(id);
        if (post.deleted_at) {
            throw NotFoundDomainException.create('Entity is already deleted');
        }
        await this.dataSource.query(
            `
                UPDATE public.posts
                SET deleted_at = NOW()
                WHERE id = $1
                `,
            [id],
        );
    }
}
