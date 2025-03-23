import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { CreateCommentDomainDto } from '../../domain/dto/create';
import { CommentWithCommentatorInfo } from '../../domain/comment.entity';
import { UpdateCommentDomainDto } from '../../domain/dto/update';

@Injectable()
export class CommentsRepository {
    constructor(private dataSource: DataSource) {}
    async addNewComment(comment: CreateCommentDomainDto): Promise<number> {
        const data: { id: number }[] = await this.dataSource.query(
            `
                INSERT INTO public.comments (post_id, user_id, content)
                VALUES ($1, $2, $3)
                RETURNING id
                `,
            [comment.postId, comment.userId, comment.content],
        );

        return data[0].id;
    }

    async findByIdNonDeleted(
        id: number,
    ): Promise<CommentWithCommentatorInfo | null> {
        const data: CommentWithCommentatorInfo[] = await this.dataSource.query(
            `
                SELECT c.* , u.login AS userLogin, u.id AS userId FROM public.comments c 
                JOIN public.users u ON c.user_id = u.id
                WHERE c.id = $1 AND c.deleted_at IS NULL    
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByIdNonDeletedOrNotFoundFail(
        id: number,
    ): Promise<CommentWithCommentatorInfo> {
        const comment = await this.findByIdNonDeleted(id);

        if (!comment) {
            throw NotFoundDomainException.create('Comment not found');
        }

        return comment;
    }

    async findAllByPostIdNonDeleted(
        postId: string,
    ): Promise<CommentWithCommentatorInfo[]> {
        const data: CommentWithCommentatorInfo[] = await this.dataSource.query(
            `
                SELECT c.* , u.login AS userLogin, u.id AS userId FROM public.comments c 
                JOIN public.users u ON c.user_id = u.id
                WHERE c.post_id = $1 AND c.deleted_at IS NULL
                `,
            [postId],
        );

        return data;
    }

    async findAllByPostIdsNonDeleted(
        postIds: number[],
    ): Promise<CommentWithCommentatorInfo[]> {
        const data: CommentWithCommentatorInfo[] = await this.dataSource.query(
            `
                SELECT c.* , u.login AS userLogin, u.id AS userId FROM public.comments c 
                JOIN public.users u ON c.user_id = u.id
                WHERE c.post_id = ANY($1) AND c.deleted_at IS NULL
                `,
            [postIds],
        );

        return data;
    }

    async updateCommentById(id: number, dto: UpdateCommentDomainDto) {
        await this.findByIdNonDeletedOrNotFoundFail(id);

        await this.dataSource.query(
            `
                UPDATE public.comments
                SET content = $1 WHERE id = $2
            `,
            [dto.content, id],
        );
    }

    async makeDeletedAllByPostId(postId: number): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE public.comments
                SET deleted_at = NOW()
                WHERE post_id = $1
                `,
            [postId],
        );
    }

    async makeDeletedAllByPostIds(postIds: number[]): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE public.comments
                SET deleted_at = NOW()
                WHERE post_id = ANY($1)
                `,
            [postIds],
        );
    }
}
