import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeDto } from '../../../dto/update';
import { LikesRepository } from '../../../infrastructure';
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
    constructor(private likesRepository: LikesRepository) {}

    async execute({
        dto,
        parentId,
        parentType,
        userId,
    }: UpdateLikeStatusCommand): Promise<void> {
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
