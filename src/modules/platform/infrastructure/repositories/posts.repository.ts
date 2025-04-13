import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { PostEntity } from '../../domain/post.entity';
import { CreatePostDomainDto } from '../../domain/dto/create';
import { UpdatePostDomainDto } from '../../domain/dto/update';

@Injectable()
export class PostsRepository {
    constructor(
        @InjectRepository(PostEntity)
        private postsRepo: Repository<PostEntity>,
    ) {}

    async findById(id: number): Promise<PostEntity | null> {
        return this.postsRepo.findOne({
            where: { id },
        });
    }

    async findByIdOrNotFoundFail(id: number): Promise<PostEntity> {
        const post = await this.findById(id);

        if (!post) {
            throw NotFoundDomainException.create('Post not found');
        }

        return post;
    }

    async findByIdNonDeletedOrNotFoundFail(id: number): Promise<PostEntity> {
        const post = await this.postsRepo.findOne({
            where: { id, deleted_at: IsNull() },
        });

        if (!post) {
            throw NotFoundDomainException.create('Post not found');
        }
        return post;
    }

    async findAllByBlogIdNonDeleted(blogId: number): Promise<PostEntity[]> {
        return this.postsRepo.find({
            where: { blog_id: blogId, deleted_at: IsNull() },
        });
    }

    async addNewPost(post: CreatePostDomainDto): Promise<number> {
        // const data: { id: number }[] = await this.dataSource.query(
        //     `
        //         INSERT INTO public.posts (title, short_description, content, blog_id, blog_name)
        //         VALUES ($1, $2, $3, $4, $5)
        //         RETURNING id
        //         `,
        //     [
        //         post.title,
        //         post.shortDescription,
        //         post.content,
        //         post.blogId,
        //         post.blogName,
        //     ],
        // );

        // return data[0].id;

        const postEntity = this.postsRepo.create({
            title: post.title,
            short_description: post.shortDescription,
            content: post.content,
            blog_id: post.blogId,
            blog_name: post.blogName,
        });

        await this.postsRepo.save(postEntity);

        return postEntity.id;
    }

    async updatePostById(id: number, updatePostDto: UpdatePostDomainDto) {
        const post = await this.findByIdNonDeletedOrNotFoundFail(id);

        // let query = `
        //     UPDATE public.posts
        //     SET
        // `;

        // const params: (string | number)[] = [];
        // let paramIndex = 1;
        // let hasUpdates = false;

        // if (dto.title) {
        //     query += `title = $${paramIndex}`;
        //     params.push(dto.title);
        //     paramIndex++;
        //     hasUpdates = true;
        // }

        // if (dto.shortDescription) {
        //     if (hasUpdates) {
        //         query += `, `;
        //     }
        //     query += `short_description = $${paramIndex}`;
        //     params.push(dto.shortDescription);
        //     paramIndex++;
        //     hasUpdates = true;
        // }

        // if (dto.content) {
        //     if (hasUpdates) {
        //         query += `, `;
        //     }
        //     query += `content = $${paramIndex}`;
        //     params.push(dto.content);
        //     paramIndex++;
        //     hasUpdates = true;
        // }

        // query += ` WHERE id = $${paramIndex}`;
        // params.push(id);

        // if (hasUpdates) {
        //     await this.dataSource.query(query, params);
        // }

        const updatedPost = { ...post };

        if (updatePostDto.title) {
            updatedPost.title = updatePostDto.title;
        }

        if (updatePostDto.shortDescription) {
            updatedPost.short_description = updatePostDto.shortDescription;
        }

        if (updatePostDto.content) {
            updatedPost.content = updatePostDto.content;
        }

        const updatedPostEntity = this.postsRepo.create(updatedPost);

        await this.postsRepo.save(updatedPostEntity);

        return updatedPostEntity.id;
    }

    async makeDeletedAllByBlogId(blogId: number): Promise<void> {
        // await this.dataSource.query(
        //     `
        //         UPDATE public.posts
        //         SET deleted_at = NOW()
        //         WHERE blog_id = $1
        //         `,
        //     [blogId],
        // );

        await this.postsRepo.softDelete({ blog_id: blogId });
    }

    async makePostDeletedById(id: number): Promise<void> {
        const post = await this.findByIdOrNotFoundFail(id);
        if (post.deleted_at) {
            throw NotFoundDomainException.create('Entity is already deleted');
        }
        await this.postsRepo.softDelete({ id });
        // await this.dataSource.query(
        //     `
        //         UPDATE public.posts
        //         SET deleted_at = NOW()
        //         WHERE id = $1
        //         `,
        //     [id],
        // );
    }
}
