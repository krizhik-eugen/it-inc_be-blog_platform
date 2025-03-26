import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { CreateLikeDomainDto } from '../../domain/dto/create';
import { UpdateLikesCountDto } from '../../dto/update';
import { Like, LikeParentType, LikeStatus } from '../../domain/like.entity';
import { UpdateLikeDomainDto } from '../../domain/dto/update';

@Injectable()
export class LikesRepository {
    constructor(private dataSource: DataSource) {}

    async createLike(dto: CreateLikeDomainDto) {
        const data: { id: number }[] = await this.dataSource.query(
            `
                INSERT INTO public.likes (parent_id, parent_type, user_id, status)
                VALUES ($1, $2, $3, $4)
                RETURNING id
                `,
            [dto.parentId, dto.parentType, dto.userId, dto.status],
        );

        return data[0].id;
    }

    async findByIdNonDeleted(id: string): Promise<Like | null> {
        const data: Like[] = await this.dataSource.query(
            `
                SELECT *
                FROM public.likes
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByUserIdAndParentIdAndTypeNonDeleted({
        userId,
        parentId,
        parentType,
    }: {
        userId: number;
        parentId: number;
        parentType: LikeParentType;
    }): Promise<Like | null> {
        const data: Like[] = await this.dataSource.query(
            `
                SELECT *
                FROM public.likes
                WHERE user_id = $1 AND parent_id = $2 AND parent_type = $3 AND deleted_at IS NULL
                `,
            [userId, parentId, parentType],
        );

        return data[0] || null;
    }

    async findByIdNonDeletedOrNotFoundFail(id: string): Promise<Like> {
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
        const data: Like[] = await this.dataSource.query(
            `
                SELECT *
                FROM public.likes
                WHERE user_id = $1 AND parent_id = $2 AND parent_type = $3 AND deleted_at IS NULL
                `,
            [userId, parentId, parentType],
        );

        return data[0] ? data[0].status : LikeStatus.None;
    }

    async getLikesArray({
        parentIdsArray,
        parentType,
        userId,
    }: {
        parentIdsArray: number[];
        parentType: LikeParentType;
        userId: number;
    }) {
        const data: Like[] = await this.dataSource.query(
            `
                SELECT *
                FROM public.likes
                WHERE user_id = $1 AND parent_id = ANY($2) AND parent_type = $3 AND deleted_at IS NULL
                `,
            [userId, parentIdsArray, parentType],
        );
        return data;
    }

    async makeDeletedAllByParentIdAndType(
        parentId: number,
        parentType: LikeParentType,
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE public.likes
                SET deleted_at = NOW()
                WHERE parent_id = $1 AND parent_type = $2 AND deleted_at IS NULL
            `,
            [parentId, parentType],
        );
    }

    async updateLikeStatusByParentIdAndType(dto: UpdateLikeDomainDto) {
        await this.dataSource.query(
            `
                UPDATE public.likes
                SET status = $1
                WHERE parent_id = $2 AND parent_type = $3 AND deleted_at IS NULL
            `,
            [dto.status, dto.parentId, dto.parentType],
        );
    }

    async deleteAllByParentIdsAndType(
        parentIds: number[],
        parentType: LikeParentType,
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE public.likes
                SET deleted_at = NOW()
                WHERE parent_id = ANY($1) AND parent_type = $2 AND deleted_at IS NULL
            `,
            [parentIds, parentType],
        );
    }
}
