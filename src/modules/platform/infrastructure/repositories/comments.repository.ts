import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions';
import {
    CommentDocument,
    CommentModelType,
    Comment,
} from '../../domain/comment.entity';

export class CommentsRepository {
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
    ) {}

    async save(comment: CommentDocument) {
        return comment.save();
    }

    async findById(id: string): Promise<CommentDocument | null> {
        return this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByIdOrNotFoundFail(id: string): Promise<CommentDocument> {
        const comment = await this.findById(id);

        if (!comment) {
            throw NotFoundDomainException.create('Comment not found');
        }

        return comment;
    }

    async findByIdNonDeletedOrNotFoundFail(
        id: string,
    ): Promise<CommentDocument> {
        const comment = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!comment) {
            throw NotFoundDomainException.create('Comment not found');
        }
        return comment;
    }

    async findAllByPostIdNonDeleted(
        postId: string,
    ): Promise<CommentDocument[]> {
        return this.CommentModel.find({
            postId: postId,
            deletedAt: null,
        });
    }

    async findAllByPostIdsNonDeleted(
        postIds: string[],
    ): Promise<CommentDocument[]> {
        return this.CommentModel.find({
            postId: { $in: postIds },
            deletedAt: null,
        });
    }

    async deleteAllByPostId(postId: string): Promise<void> {
        await this.CommentModel.updateMany(
            { postId: postId, deletedAt: null },
            { deletedAt: new Date().toISOString() },
        );
    }

    async deleteAllByPostIds(postIds: string[]): Promise<void> {
        await this.CommentModel.updateMany(
            { postId: { $in: postIds }, deletedAt: null },
            { deletedAt: new Date().toISOString() },
        );
    }
}
