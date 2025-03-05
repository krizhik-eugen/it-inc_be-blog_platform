import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetUsersQueryParams } from '../../api/dto/query-params-dto';
import { PaginatedUsersViewDto, UserViewDto } from '../../api/dto/view-dto';

export interface IPostgresEmailConfirmation {
    id: number;
    user_id: number;
    confirmation_code: string;
    expiration_date: Date;
    is_confirmed: boolean;
}

export interface IPostgresRecoveryCode {
    id: number;
    user_id: number;
    recovery_code: string;
    expiration_date: Date;
}

export interface IPostgresUser {
    id: number;
    login: string;
    password_hash: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

@Injectable()
export class UsersPostgresQueryRepository {
    constructor(private dataSource: DataSource) {}
    async getAllUsers(
        query: GetUsersQueryParams,
    ): Promise<PaginatedUsersViewDto> {
        //TODO: add pagination
        let result: IPostgresUser[] = [];
        try {
            result = await this.dataSource.query<IPostgresUser[]>(`
                SELECT * FROM public.users
            `);
        } catch (e) {
            console.log('e', e);
        }

        console.log('result', result);

        const mappedUsers = result.map((user) => ({
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.created_at,
        }));

        return PaginatedUsersViewDto.mapToView({
            items: [],
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: result.length,
        });
    }

    async getUserById(id: string) {
        let data;
        try {
            data = await this.dataSource.query(
                `
                SELECT * FROM public.users
                WHERE id = $1
                `,
                [id],
            );
        } catch (e) {
            console.log('e', e);
        }

        console.log('data', data);

        return data.map((user) => ({
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        }));
    }
}
