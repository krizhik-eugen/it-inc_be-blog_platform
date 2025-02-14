import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateLikeDto } from '../../../dto/update/update-like.dto';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';
import { LikesRepository } from '../../../infrastructure/repositories/likes.repository';
import { Like, LikeModelType } from '../../../domain/like.entity';

export class UpdatePostLikeStatusCommand {
    constructor(
        public postId: string,
        public dto: UpdateLikeDto,
        public userId: string,
    ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase
    implements ICommandHandler<UpdatePostLikeStatusCommand, void>
{
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
        private postsRepository: PostsRepository,
        private likesRepository: LikesRepository,
    ) {}

    async execute({
        postId,
        dto,
        userId,
    }: UpdatePostLikeStatusCommand): Promise<void> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);

        const like = await this.likesRepository.findByUserIdAndParentId(
            userId,
            postId,
        );

        if (!like) {
            const newLike = this.LikeModel.createInstance({
                userId,
                parentId: postId,
                status: dto.likeStatus,
            });
            await this.likesRepository.save(newLike);
        } else {
            like.update({
                status: dto.likeStatus,
            });
            await this.likesRepository.save(like);
        }

        const likesAndDislikesCount =
            await this.likesRepository.getLikesAndDislikesCountByParentId(
                postId,
            );

        post.updateLikesCount(likesAndDislikesCount);

        await this.postsRepository.save(post);
    }
}
