import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
    PaginatedUsersViewDto,
    MeViewDto,
    UserViewDto,
} from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { User } from '../../domain/user.entity';
import {
    GetUsersQueryParams,
    UsersSortBy,
} from '../../api/dto/query-params-dto';

@Injectable()
export class UsersQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getCurrentUserByIdOrNotFoundFail(id: number) {
        const data: User[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE id = $1 AND deleted_at IS NULL
            `,
            [id],
        );

        if (!data.length) {
            throw NotFoundDomainException.create('User is not found');
        }

        return MeViewDto.mapToView(data[0]);
    }

    async getByIdOrNotFoundFail(id: number): Promise<UserViewDto> {
        const data: User[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        if (!data.length) {
            throw NotFoundDomainException.create('User is not found');
        }

        return UserViewDto.mapToView(data[0]);
    }

    async getAllUsers(
        query: GetUsersQueryParams,
    ): Promise<PaginatedUsersViewDto> {
        const queryParams: (string | number)[] = [];
        let paramIndex = 1;

        const searchLoginTerm = query.searchLoginTerm
            ? query.searchLoginTerm
            : null;
        const searchEmailTerm = query.searchEmailTerm
            ? query.searchEmailTerm
            : null;

        let sqlQuery = `
            WITH filtered_users AS (
                SELECT * FROM users
                WHERE deleted_at IS NULL
        `;

        if (searchLoginTerm) {
            sqlQuery += ` AND login ILIKE $${paramIndex}`;
            queryParams.push(`%${searchLoginTerm}%`);
            paramIndex++;
        }

        if (searchEmailTerm) {
            sqlQuery += ` ${searchLoginTerm ? 'OR' : 'AND'} email ILIKE $${paramIndex}`;
            queryParams.push(`%${searchEmailTerm}%`);
            paramIndex++;
        }

        sqlQuery += `
            )
            SELECT 
                filtered_users.*,
                COUNT(*) OVER() AS total_count
            FROM filtered_users
            ORDER BY ${this.sanitizeSortField(query.sortBy)} ${query.sortDirection}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        queryParams.push(query.pageSize, query.calculateSkip());

        const result: Array<User & { total_count: string }> =
            await this.dataSource.query(sqlQuery, queryParams);

        const totalCount = Number(result[0]?.total_count) || 0;
        const mappedUsers = result.map((user) => UserViewDto.mapToView(user));

        return PaginatedUsersViewDto.mapToView({
            items: mappedUsers,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: totalCount,
        });
    }

    private sanitizeSortField(
        field: UsersSortBy,
    ): 'login' | 'email' | 'created_at' {
        switch (field) {
            case UsersSortBy.Login:
                return 'login';
            case UsersSortBy.Email:
                return 'email';
            case UsersSortBy.CreatedAt:
                return 'created_at';
            default:
                return 'created_at';
        }
    }
}
