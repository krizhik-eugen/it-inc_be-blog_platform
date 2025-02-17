import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { LikesRepository } from '../../../infrastructure/repositories/likes.repository';
import { Like, LikeModelType } from '../../../domain/like.entity';
import { CommentDocument } from '../../../domain/comment.entity';
import {
    UpdateLikeStatusBaseCommand,
    UpdateLikeStatusBaseUseCase,
} from '../base/update-like-status.base-use-case';

export class UpdateCommentLikeStatusCommand extends UpdateLikeStatusBaseCommand {}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase
    extends UpdateLikeStatusBaseUseCase<CommentDocument>
    implements ICommandHandler<UpdateCommentLikeStatusCommand, void>
{
    constructor(
        @InjectModel(Like.name)
        LikeModel: LikeModelType,
        likesRepository: LikesRepository,
        private commentsRepository: CommentsRepository,
    ) {
        super(LikeModel, likesRepository);
    }

    async getParentById(commentId: string): Promise<CommentDocument> {
        return this.commentsRepository.findByIdOrNotFoundFail(commentId);
    }

    async saveParent(comment: CommentDocument): Promise<CommentDocument> {
        return this.commentsRepository.save(comment);
    }
}
