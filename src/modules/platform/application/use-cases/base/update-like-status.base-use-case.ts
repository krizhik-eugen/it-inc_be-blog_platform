import { ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateLikeDto } from '../../../dto/update/update-like.dto';
import { Like, LikeModelType } from '../../../domain/like.entity';
import { LikesRepository } from '../../../infrastructure/repositories/likes.repository';
import { ParentLikesEntity } from '../../../domain/parent-likes.entity';

export abstract class UpdateLikeStatusBaseCommand {
    constructor(
        public parentId: string,
        public dto: UpdateLikeDto,
        public userId: string,
    ) {}
}

export abstract class UpdateLikeStatusBaseUseCase<T extends ParentLikesEntity>
    implements ICommandHandler<UpdateLikeStatusBaseCommand, void>
{
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
        private likesRepository: LikesRepository,
    ) {}

    abstract getParentById(id: string): Promise<T>;

    abstract saveParent(entity: T): Promise<T>;

    async execute({
        parentId,
        dto,
        userId,
    }: UpdateLikeStatusBaseCommand): Promise<void> {
        const parent = await this.getParentById(parentId);

        const like = await this.likesRepository.findByUserIdAndParentId({
            userId,
            parentId,
        });

        if (!like) {
            const newLike = this.LikeModel.createInstance({
                userId,
                parentId,
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
                parentId,
            );

        parent.updateLikesCount(likesAndDislikesCount);

        await this.saveParent(parent);
    }
}
