import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
    LikeEntity,
    LikeParentType,
    LikeStatus,
} from '../../domain/like.entity';
import { LikeViewDto } from '../../api/dto/view-dto';
import { UserEntity } from '../../../accounts/domain/user.entity';
import { UsersService } from '../../../accounts/application/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LikesQueryRepository {
    constructor(
        @InjectRepository(LikeEntity)
        private likeRepo: Repository<LikeEntity>,
        private usersService: UsersService,
    ) {}

    async getLastThreeLikes(parentId: number, parentType: LikeParentType) {
        // const foundLikes: LikeEntity[] = await this.dataSource.query(
        //     `
        //         SELECT *
        //         FROM public.likes
        //         WHERE parent_id = $1 AND parent_type = $2 AND status = 'Like' AND deleted_at IS NULL
        //         ORDER BY created_at DESC
        //         LIMIT 3
        //     `,
        //     [parentId, parentType],
        // );

        const foundLikes = await this.likeRepo
            .createQueryBuilder('l')
            .where('l.parent_id = :parentId', { parentId })
            .andWhere('l.parent_type = :parentType', { parentType })
            .andWhere('l.status = :status', { status: LikeStatus.Like })
            .andWhere('l.deleted_at IS NULL')
            .orderBy('l.created_at', 'DESC')
            .limit(3)
            .getMany();

        const userIds = foundLikes.map((like) => like.user_id);
        const users = await this.usersService.findByIds(userIds);

        const mappedFoundLikes: LikeViewDto[] = [];
        for (const like of foundLikes) {
            const user = users.find((u: UserEntity) => u.id === like.user_id);
            mappedFoundLikes.push({
                addedAt: new Date(like.created_at).toISOString(),
                userId: like.user_id.toString(),
                login: user?.login || '',
            });
        }
        return mappedFoundLikes;
    }
}
