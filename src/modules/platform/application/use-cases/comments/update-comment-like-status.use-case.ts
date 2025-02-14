import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeDto } from '../../../dto/update/update-like.dto';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { LikesRepository } from '../../../infrastructure/repositories/likes.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../../../domain/like.entity';

export class UpdateCommentLikeStatusCommand {
    constructor(
        public commentId: string,
        public dto: UpdateLikeDto,
        public userId: string,
    ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase
    implements ICommandHandler<UpdateCommentLikeStatusCommand, void>
{
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
        private commentsRepository: CommentsRepository,
        private likesRepository: LikesRepository,
    ) {}

    async execute({
        commentId,
        dto,
        userId,
    }: UpdateCommentLikeStatusCommand): Promise<void> {
        const comment =
            await this.commentsRepository.findByIdNonDeletedOrNotFoundFail(
                commentId,
            );

        const like = await this.likesRepository.findByUserIdAndParentId(
            userId,
            commentId,
        );
        if (!like) {
            const newLike = this.LikeModel.createInstance({
                userId,
                parentId: commentId,
                status: dto.status,
            });
            await this.likesRepository.save(newLike);
        } else {
            like.update(dto);
            await this.likesRepository.save(like);
        }

        const likesAndDislikesCount =
            await this.likesRepository.getLikesAndDislikesCountByParentId(
                commentId,
            );

        comment.updateLikesCount(likesAndDislikesCount);

        await this.commentsRepository.save(comment);
    }
}
