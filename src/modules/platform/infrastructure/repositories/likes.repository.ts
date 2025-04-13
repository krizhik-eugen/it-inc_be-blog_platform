import { Injectable } from '@nestjs/common';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { CreateLikeDomainDto } from '../../domain/dto/create';
import { UpdateLikesCountDto } from '../../dto/update';
import {
    LikeEntity,
    LikeParentType,
    LikeStatus,
} from '../../domain/like.entity';
import { UpdateLikeDomainDto } from '../../domain/dto/update';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LikesRepository {
    constructor(
        @InjectRepository(LikeEntity)
        private likeRepo: Repository<LikeEntity>,
        private dataSource: DataSource,
    ) {}

    async createLike(dto: CreateLikeDomainDto) {
        const newLike = this.likeRepo.create({
            parent_id: dto.parentId,
            parent_type: dto.parentType,
            user_id: dto.userId,
            status: dto.status,
        });

        await this.likeRepo.save(newLike);

        return newLike.id;
    }

    async findByIdNonDeleted(id: number): Promise<LikeEntity | null> {
        const like = await this.likeRepo.findOne({
            where: { id, deleted_at: IsNull() },
        });

        return like;
    }

    async findByUserIdAndParentIdAndTypeNonDeleted({
        userId,
        parentId,
        parentType,
    }: {
        userId: number;
        parentId: number;
        parentType: LikeParentType;
    }): Promise<LikeEntity | null> {
        const like = await this.likeRepo.findOne({
            where: {
                user_id: userId,
                parent_id: parentId,
                parent_type: parentType,
                deleted_at: IsNull(),
            },
        });

        return like;
    }

    async findByIdNonDeletedOrNotFoundFail(id: number): Promise<LikeEntity> {
        const like = await this.findByIdNonDeleted(id);

        if (!like) {
            throw NotFoundDomainException.create('Like not found');
        }

        return like;
    }

    async getLikesAndDislikesCountByParentId(
        parentId: number,
        parentType: LikeParentType,
    ): Promise<UpdateLikesCountDto> {
        const result: { likes_count: string; dislikes_count: string }[] =
            await this.dataSource.query(
                `
                SELECT
                    SUM(CASE WHEN status = 'Like' THEN 1 ELSE 0 END) AS likes_count,
                    SUM(CASE WHEN status = 'Dislike' THEN 1 ELSE 0 END) AS dislikes_count
                FROM public.likes
                WHERE parent_id = $1 AND parent_type = $2 AND deleted_at IS NULL
            `,
                [parentId, parentType],
            );

        return {
            likesCount: result[0].likes_count
                ? parseInt(result[0].likes_count)
                : 0,
            dislikesCount: result[0].dislikes_count
                ? parseInt(result[0].dislikes_count)
                : 0,
        };
    }

    async getLikeStatusByUserIdAndParentIdAndType({
        parentId,
        userId,
        parentType,
    }: {
        parentId: number;
        userId: number;
        parentType: LikeParentType;
    }): Promise<LikeStatus> {
        const like = await this.findByUserIdAndParentIdAndTypeNonDeleted({
            userId,
            parentId,
            parentType,
        });

        return like ? like.status : LikeStatus.None;
    }

    // async getLikesArray({
    //     parentIdsArray,
    //     parentType,
    //     userId,
    // }: {
    //     parentIdsArray: number[];
    //     parentType: LikeParentType;
    //     userId: number;
    // }) {
    //     const data: Like[] = await this.dataSource.query(
    //         `
    //             SELECT *
    //             FROM public.likes
    //             WHERE user_id = $1 AND parent_id = ANY($2) AND parent_type = $3 AND deleted_at IS NULL
    //             `,
    //         [userId, parentIdsArray, parentType],
    //     );
    //     return data;
    // }

    async getParentsLikesAndCountArray({
        parentIdsArray,
        parentType,
        userId,
    }: {
        parentIdsArray: number[];
        parentType: LikeParentType;
        userId: number;
    }): Promise<
        Array<{
            parent_id: number;
            like_status: LikeStatus;
            likes_count: number;
            dislikes_count: number;
        }>
    > {
        const results: Array<{
            parent_id: number;
            status: LikeStatus | null;
            likes_count: string;
            dislikes_count: string;
        }> = await this.dataSource.query(
            `
            WITH like_counts AS (
                SELECT 
                    parent_id,
                    SUM(CASE WHEN status = 'Like' THEN 1 ELSE 0 END) AS likes_count,
                    SUM(CASE WHEN status = 'Dislike' THEN 1 ELSE 0 END) AS dislikes_count
                FROM public.likes
                WHERE parent_id = ANY($2) AND parent_type = $3 AND deleted_at IS NULL
                GROUP BY parent_id
            ),
            user_likes AS (
                SELECT parent_id, status
                FROM public.likes
                WHERE user_id = $1 AND parent_id = ANY($2) AND parent_type = $3 AND deleted_at IS NULL
            )
            SELECT 
                lc.parent_id,
                ul.status AS status,
                COALESCE(lc.likes_count::text, '0') AS likes_count,
                COALESCE(lc.dislikes_count::text, '0') AS dislikes_count
            FROM like_counts lc
            LEFT JOIN user_likes ul ON lc.parent_id = ul.parent_id
            `,
            [userId, parentIdsArray, parentType],
        );

        return results.map((result) => ({
            parent_id: result.parent_id,
            like_status: result.status ?? LikeStatus.None,
            likes_count: result.likes_count ? parseInt(result.likes_count) : 0,
            dislikes_count: result.dislikes_count
                ? parseInt(result.dislikes_count)
                : 0,
        }));
    }

    async makeDeletedAllByParentIdAndType(
        parentId: number,
        parentType: LikeParentType,
    ): Promise<void> {
        await this.likeRepo.softDelete({
            parent_id: parentId,
            parent_type: parentType,
            deleted_at: IsNull(),
        });
    }

    async updateLikeStatusByParentIdAndType(dto: UpdateLikeDomainDto) {
        await this.likeRepo.update(
            {
                parent_id: dto.parentId,
                parent_type: dto.parentType,
                deleted_at: IsNull(),
            },
            { status: dto.status },
        );
    }

    async deleteAllByParentIdsAndType(
        parentIds: number[],
        parentType: LikeParentType,
    ): Promise<void> {
        await this.likeRepo.softDelete({
            parent_id: In(parentIds),
            parent_type: parentType,
            deleted_at: IsNull(),
        });
    }
}
