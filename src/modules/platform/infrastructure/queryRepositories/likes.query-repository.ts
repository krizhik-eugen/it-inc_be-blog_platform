import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType, LikeStatus } from '../../domain/like.entity';
import { LikeViewDto } from '../../api/dto/view-dto';
import { MongoUserDocument } from '../../../accounts/domain/user.entity';
import { UsersMongoRepository } from '../../../accounts/infrastructure';

export class LikesQueryRepository {
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
        private usersMongoRepository: UsersMongoRepository,
    ) {}

    async getLikeStatusByUserIdAndParentId({
        parentId,
        userId,
    }: {
        parentId: string;
        userId: string;
    }): Promise<LikeStatus> {
        const like = await this.LikeModel.findOne({
            userId,
            parentId,
            deletedAt: null,
        });

        return like ? like.status : LikeStatus.None;
    }

    async getLikesArray({
        parentIdsArray,
        userId,
    }: {
        parentIdsArray: string[];
        userId: string;
    }) {
        const foundLikes = await this.LikeModel.find({
            parentId: { $in: parentIdsArray },
            userId,
        }).lean();
        return foundLikes;
    }

    async getLastThreeLikes(parentId: string) {
        const foundLikes = await this.LikeModel.find({
            parentId,
            status: LikeStatus.Like,
        })
            .sort({ createdAt: 'desc' })
            .limit(3)
            .exec();

        const userIds = foundLikes.map((like) => like.userId);
        const users = await this.usersMongoRepository.findByIds(userIds);

        const mappedFoundLikes: LikeViewDto[] = [];
        for (const like of foundLikes) {
            const user = users.find(
                (u: MongoUserDocument) => u._id.toString() === like.userId,
            );
            mappedFoundLikes.push({
                addedAt: like.createdAt,
                userId: like.userId,
                login: user?.login || '',
            });
        }
        return mappedFoundLikes;
    }
}
