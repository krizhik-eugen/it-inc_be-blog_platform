import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType, LikeStatus } from '../../domain/like.entity';
import { LikeViewDto } from '../../api/dto/view-dto';
import { UsersPostgresRepository } from '../../../accounts/infrastructure';
import { PostgresUser } from '../../../accounts/domain/user.postgres-entity';

export class LikesQueryRepository {
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
        // private usersMongoRepository: UsersMongoRepository,
        private usersPostgresRepository: UsersPostgresRepository,
    ) {}

    async getLikeStatusByUserIdAndParentId({
        parentId,
        userId,
    }: {
        parentId: string;
        userId: number;
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
        userId: number;
    }) {
        const foundLikes = await this.LikeModel.find({
            parentId: { $in: parentIdsArray },
            userId,
        }).lean();
        return foundLikes;
    }

    async getLastThreeLikes(parentId: number) {
        const foundLikes = await this.LikeModel.find({
            parentId,
            status: LikeStatus.Like,
        })
            .sort({ createdAt: 'desc' })
            .limit(3)
            .exec();

        const userIds = foundLikes.map((like) => like.userId);
        const users = await this.usersPostgresRepository.findByIds(userIds);

        const mappedFoundLikes: LikeViewDto[] = [];
        for (const like of foundLikes) {
            const user = users.find((u: PostgresUser) => u.id === like.userId);
            mappedFoundLikes.push({
                addedAt: like.createdAt,
                userId: like.userId.toString(),
                login: user?.login || '',
            });
        }
        return mappedFoundLikes;
    }
}
