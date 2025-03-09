import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
    PaginatedPostgresUsersViewDto,
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

        return PostgresUserViewDto.mapToView(data[0]);
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
        // Build the base query with parameters
        const queryParams: string[] = [];
        let paramCounter = 1;

        // Add search parameters if provided
        const searchLoginTerm = query.searchLoginTerm
            ? query.searchLoginTerm
            : null;
        const searchEmailTerm = query.searchEmailTerm
            ? query.searchEmailTerm
            : null;

        // Create the main query
        let sqlQuery = `
            WITH filtered_users AS (
                SELECT * FROM users
                WHERE deleted_at IS NULL
        `;

        // Add search conditions
        if (searchLoginTerm) {
            sqlQuery += ` AND login ILIKE $${paramCounter}`;
            queryParams.push(`%${searchLoginTerm}%`);
            paramCounter++;
        }

        if (searchEmailTerm) {
            sqlQuery += ` AND email ILIKE $${paramCounter}`;
            queryParams.push(`%${searchEmailTerm}%`);
            paramCounter++;
        }

        sqlQuery += `
            )
            SELECT 
                filtered_users.*,
                COUNT(*) OVER() AS total_count
            FROM filtered_users
            ORDER BY ${this.sanitizeSortField(query.sortBy)} ${query.sortDirection}
            LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
        `;

        // Add pagination parameters
        queryParams.push(query.pageSize.toString());
        queryParams.push(query.calculateSkip().toString());

        // Execute the query
        const result: Array<PostgresUser & { total_count: string }> =
            await this.dataSource.query(sqlQuery, queryParams);

        // Map the results
        const totalCount = Number(result[0]?.total_count) || 0;
        const mappedUsers = result.map((user) =>
            PostgresUserViewDto.mapToView(user),
        );

        // Return paginated results
        return PaginatedPostgresUsersViewDto.mapToView({
            items: mappedUsers,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: totalCount,
        });
    }

    // Helper method to prevent SQL injection in sort fields
    private sanitizeSortField(field: string): string {
        const allowedFields = [
            'id',
            'login',
            'email',
            'created_at',
            'updated_at',
        ];
        if (!allowedFields.includes(field.toLowerCase())) {
            return 'created_at'; // Default sort field if invalid
        }
        return field;
    }
}
