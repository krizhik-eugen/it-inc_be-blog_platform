import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType, LikeStatus } from '../../domain/like.entity';
import { UsersRepository } from '../../../accounts/infrastructure/repositories/users.repository';
import { LikeViewDto } from '../../api/dto/view-dto/likes.view-dto';
import { UserDocument } from 'src/modules/accounts/domain/user.entity';

export class LikesQueryRepository {
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
        private usersRepository: UsersRepository,
    ) {}

    async getLikeStatusByUserIdAndParentId(
        userId: string,
        parentId: string,
    ): Promise<LikeStatus> {
        const like = await this.LikeModel.findOne({
            userId,
            parentId,
            deletedAt: null,
        });

        return like ? like.status : LikeStatus.None;
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
        const users = await this.usersRepository.findByIds(userIds);

        const mappedFoundLikes: LikeViewDto[] = [];
        for (const like of foundLikes) {
            const user = users.find(
                (u: UserDocument) => u._id.toString() === like.userId,
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
