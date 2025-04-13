import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { CreateCommentDomainDto } from '../../domain/dto/create';
import {
    CommentEntity,
    CommentWithUserLogin,
} from '../../domain/comment.entity';
import { UpdateCommentDomainDto } from '../../domain/dto/update';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsRepository {
    constructor(
        @InjectRepository(CommentEntity)
        private commentsRepo: Repository<CommentEntity>,
    ) {}
    async addNewComment(comment: CreateCommentDomainDto): Promise<number> {
        const newComment = this.commentsRepo.create({
            post_id: comment.postId,
            user_id: comment.userId,
            content: comment.content,
        });

        await this.commentsRepo.save(newComment);

        return newComment.id;
    }

    async findByIdNonDeleted(id: number): Promise<CommentWithUserLogin | null> {
        const comment = await this.commentsRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .addSelect(['u.login'])
            .where('c.id = :id', { id })
            .andWhere('c.deleted_at IS NULL')
            .getOne();

        if (!comment) return null;
        const result: CommentWithUserLogin = {
            ...comment,
            user_login: comment.user?.login,
        };

        return result;
    }

    async findByIdNonDeletedOrNotFoundFail(
        id: number,
    ): Promise<CommentWithUserLogin> {
        const comment = await this.findByIdNonDeleted(id);

        if (!comment) {
            throw NotFoundDomainException.create('Comment not found');
        }

        return comment;
    }

    async findAllByPostIdNonDeleted(
        postId: number,
    ): Promise<CommentWithUserLogin[]> {
        const comments = await this.commentsRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .addSelect(['u.login'])
            .where('c.post_id = :postId', { postId })
            .andWhere('c.deleted_at IS NULL')
            .getMany();

        const result: CommentWithUserLogin[] = comments.map((comment) => ({
            ...comment,
            user_login: comment.user?.login,
        }));

        return result;
    }

    async findAllByPostIdsNonDeleted(
        postIds: number[],
    ): Promise<CommentWithUserLogin[]> {
        const comments = await this.commentsRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .addSelect(['u.login'])
            .where('c.post_id = ANY(:postIds)', { postIds })
            .andWhere('c.deleted_at IS NULL')
            .getMany();

        const result: CommentWithUserLogin[] = comments.map((comment) => ({
            ...comment,
            user_login: comment.user?.login,
        }));

        return result;
    }

    async updateCommentById(id: number, dto: UpdateCommentDomainDto) {
        await this.findByIdNonDeletedOrNotFoundFail(id);

        await this.commentsRepo.update(id, dto);
    }

    async makeDeleted(id: number): Promise<void> {
        await this.commentsRepo.softDelete(id);
    }

    async makeDeletedAllByPostId(postId: number): Promise<void> {
        await this.commentsRepo.softDelete({ post_id: postId });
    }

    async makeDeletedAllByPostIds(postIds: number[]): Promise<void> {
        await this.commentsRepo.softDelete({ post_id: In(postIds) });
    }
}
