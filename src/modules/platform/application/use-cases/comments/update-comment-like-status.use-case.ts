import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsRepository, LikesRepository } from '../../../infrastructure';
import { Like, LikeModelType } from '../../../domain/like.entity';
import { CommentDocument } from '../../../domain/comment.entity';
import {
    UpdateLikeStatusBaseCommand,
    UpdateLikeStatusBaseUseCase,
} from '../base';

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
        // TODO fix types for id
        return this.commentsRepository.findByIdOrNotFoundFail(commentId);
    }

    async saveParent(comment: CommentDocument): Promise<CommentDocument> {
        return this.commentsRepository.save(comment);
    }
}
