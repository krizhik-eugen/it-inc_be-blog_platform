import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { Like, LikeDocument, LikeModelType } from '../../domain/like.entity';

export class LikesRepository {
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
    ) {}

    async save(like: LikeDocument) {
        return await like.save();
    }

    async findById(id: string): Promise<LikeDocument | null> {
        return this.LikeModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByIdOrNotFoundFail(id: string): Promise<LikeDocument> {
        const like = await this.findById(id);

        if (!like) {
            throw NotFoundDomainException.create('Like not found');
        }

        return like;
    }

    async findByIdNonDeletedOrNotFoundFail(id: string): Promise<LikeDocument> {
        const like = await this.LikeModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!like) {
            throw NotFoundDomainException.create('Like not found');
        }
        return like;
    }

    async deleteAllByParentId(parentId: string): Promise<void> {
        await this.LikeModel.updateMany(
            { parentId: parentId, deletedAt: null },
            { deletedAt: new Date().toISOString() },
        );
    }

    async deleteAllByParentIds(parentIds: string[]): Promise<void> {
        await this.LikeModel.updateMany(
            { parentId: { $in: parentIds }, deletedAt: null },
            { deletedAt: new Date().toISOString() },
        );
    }
}
