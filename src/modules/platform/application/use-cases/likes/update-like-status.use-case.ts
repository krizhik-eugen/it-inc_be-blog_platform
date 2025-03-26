import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeDto } from '../../../dto/update';
import {
    CommentsRepository,
    LikesRepository,
    PostsRepository,
} from '../../../infrastructure';
import { LikeParentType } from '../../../domain/like.entity';

export class UpdateLikeStatusCommand {
    constructor(
        public dto: UpdateLikeDto,
        public parentId: number,
        public parentType: LikeParentType,
        public userId: number,
    ) {}
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusUseCase
    implements ICommandHandler<UpdateLikeStatusCommand, void>
{
    constructor(
        private likesRepository: LikesRepository,
        private postsRepository: PostsRepository,
        private commentsRepository: CommentsRepository,
    ) {}

    async execute({
        dto,
        parentId,
        parentType,
        userId,
    }: UpdateLikeStatusCommand): Promise<void> {
        await (
            parentType === LikeParentType.Post
                ? this.postsRepository
                : this.commentsRepository
        ).findByIdNonDeletedOrNotFoundFail(parentId);

        const like =
            await this.likesRepository.findByUserIdAndParentIdAndTypeNonDeleted(
                {
                    userId,
                    parentId,
                    parentType,
                },
            );

        if (!like) {
            await this.likesRepository.createLike({
                userId,
                parentId,
                parentType,
                status: dto.likeStatus,
            });
        } else {
            await this.likesRepository.updateLikeStatusByParentIdAndType({
                parentId,
                parentType,
                status: dto.likeStatus,
            });
        }
    }
}
