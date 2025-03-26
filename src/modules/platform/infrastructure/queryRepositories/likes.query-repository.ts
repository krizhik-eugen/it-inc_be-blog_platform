import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Like, LikeParentType } from '../../domain/like.entity';
import { LikeViewDto } from '../../api/dto/view-dto';
import { UsersRepository } from '../../../accounts/infrastructure';
import { User } from '../../../accounts/domain/user.entity';

@Injectable()
export class LikesQueryRepository {
    constructor(
        private dataSource: DataSource,
        private usersRepository: UsersRepository,
    ) {}

    async getLastThreeLikes(parentId: number, parentType: LikeParentType) {
        const foundLikes: Like[] = await this.dataSource.query(
            `
                SELECT *
                FROM public.likes
                WHERE parent_id = $1 AND parent_type = $2 AND status = 'Like' AND deleted_at IS NULL
                ORDER BY created_at DESC
                LIMIT 3
            `,
            [parentId, parentType],
        );

        const userIds = foundLikes.map((like) => like.user_id);
        const users = await this.usersRepository.findByIds(userIds);

        const mappedFoundLikes: LikeViewDto[] = [];
        for (const like of foundLikes) {
            const user = users.find((u: User) => u.id === like.user_id);
            mappedFoundLikes.push({
                addedAt: new Date(like.created_at).toISOString(),
                userId: like.user_id.toString(),
                login: user?.login || '',
            });
        }
        return mappedFoundLikes;
    }
}
