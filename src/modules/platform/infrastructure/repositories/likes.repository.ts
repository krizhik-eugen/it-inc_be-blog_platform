import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions';
import {
    Like,
    LikeDocument,
    LikeModelType,
    LikeStatus,
} from '../../domain/like.entity';
import { UpdateLikesCountDto } from '../../dto/update';

export class LikesRepository {
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
    ) {}

    async save(like: LikeDocument) {
        return like.save();
    }

    async findById(id: string): Promise<LikeDocument | null> {
        return this.LikeModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByUserIdAndParentId({
        userId,
        parentId,
    }: {
        userId: number;
        parentId: string;
    }): Promise<LikeDocument | null> {
        return this.LikeModel.findOne({ userId, parentId, deletedAt: null });
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

    async getLikesAndDislikesCountByParentId(
        parentId: string,
    ): Promise<UpdateLikesCountDto> {
        const result = await this.LikeModel.aggregate([
            {
                $match: { parentId },
            },
            {
                $group: {
                    _id: null,
                    likesCount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$status', LikeStatus.Like] },
                                1,
                                0,
                            ],
                        },
                    },
                    dislikesCount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$status', LikeStatus.Dislike] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        return {
            likesCount: (result[0] as UpdateLikesCountDto).likesCount,
            dislikesCount: (result[0] as UpdateLikesCountDto).dislikesCount,
        };
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
