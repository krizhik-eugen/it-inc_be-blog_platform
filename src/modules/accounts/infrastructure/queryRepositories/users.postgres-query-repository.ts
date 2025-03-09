import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostgresUserViewDto } from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { PostgresUser } from '../../domain/user.postgres-entity';

@Injectable()
export class UsersPostgresQueryRepository {
    constructor(private dataSource: DataSource) {}
    // async getAllUsers(
    //     query: GetUsersQueryParams,
    // ): Promise<PaginatedMongoUsersViewDto> {
    //     //TODO: add pagination
    //     let result: IPostgresUser[] = [];
    //     try {
    //         result = await this.dataSource.query<IPostgresUser[]>(`
    //             SELECT * FROM public.users
    //         `);
    //     } catch (e) {
    //         console.log('e', e);
    //     }

    //     console.log('result', result);

    //     const mappedUsers = result.map((user) => ({
    //         id: user.id,
    //         login: user.login,
    //         email: user.email,
    //         createdAt: user.created_at,
    //     }));

    //     return PaginatedMongoUsersViewDto.mapToView({
    //         items: [],
    //         page: query.pageNumber,
    //         size: query.pageSize,
    //         totalCount: result.length,
    //     });
    // }

    async getByIdOrNotFoundFail(id: number): Promise<PostgresUserViewDto> {
        const data: PostgresUser[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        if (!data.length) {
            throw NotFoundDomainException.create('PostgresUser is not found');
        }

        return PostgresUserViewDto.mapToView(data[0]);
    }
}
