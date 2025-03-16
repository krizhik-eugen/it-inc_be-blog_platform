import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
    PaginatedPostgresUsersViewDto,
    PostgresMeViewDto,
    PostgresUserViewDto,
} from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { PostgresUser } from '../../domain/user.postgres-entity';
import { GetUsersQueryParams } from '../../api/dto/query-params-dto';

@Injectable()
export class UsersPostgresQueryRepository {
    constructor(private dataSource: DataSource) {}

    async getCurrentUserByIdOrNotFoundFail(id: number) {
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

        return PostgresMeViewDto.mapToView(data[0]);
    }

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

    async getAllUsers(
        query: GetUsersQueryParams,
    ): Promise<PaginatedPostgresUsersViewDto> {
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

        const result: Array<PostgresUser & { total_count: string }> =
            await this.dataSource.query(sqlQuery, queryParams);

        const totalCount = Number(result[0]?.total_count) || 0;
        const mappedUsers = result.map((user) =>
            PostgresUserViewDto.mapToView(user),
        );

        return PaginatedPostgresUsersViewDto.mapToView({
            items: mappedUsers,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: totalCount,
        });
    }

    private sanitizeSortField(field: string): string {
        const allowedFields = [
            'id',
            'login',
            'email',
            'created_at',
            'updated_at',
        ];
        if (!allowedFields.includes(field.toLowerCase())) {
            return 'created_at';
        }
        return field;
    }
}
