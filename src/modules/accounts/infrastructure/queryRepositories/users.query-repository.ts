import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import {
    PaginatedUsersViewDto,
    MeViewDto,
    UserViewDto,
} from '../../api/dto/view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { UserEntity } from '../../domain/user.entity';
import {
    GetUsersQueryParams,
    UsersSortBy,
} from '../../api/dto/query-params-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
        private dataSource: DataSource,
    ) {}

    async getCurrentUserByIdOrNotFoundFail(id: number) {
        const data: UserEntity | null = await this.usersRepo.findOneBy({
            id,
            deleted_at: IsNull(),
        });

        if (!data) {
            throw NotFoundDomainException.create('User is not found');
        }

        return MeViewDto.mapToView(data);
    }

    async getByIdOrNotFoundFail(id: number): Promise<UserViewDto> {
        const data: UserEntity | null = await this.usersRepo.findOneBy({
            id,
            deleted_at: IsNull(),
        });

        if (!data) {
            throw NotFoundDomainException.create('User is not found');
        }

        return UserViewDto.mapToView(data);
    }

    // async getAllUsers(
    //     query: GetUsersQueryParams,
    // ): Promise<PaginatedUsersViewDto> {
    //     const queryParams: (string | number)[] = [];
    //     let paramIndex = 1;

    //     const searchLoginTerm = query.searchLoginTerm
    //         ? query.searchLoginTerm
    //         : null;
    //     const searchEmailTerm = query.searchEmailTerm
    //         ? query.searchEmailTerm
    //         : null;

    //     let sqlQuery = `
    //         WITH filtered_users AS (
    //             SELECT * FROM users
    //             WHERE deleted_at IS NULL
    //     `;

    //     if (searchLoginTerm) {
    //         sqlQuery += ` AND login ILIKE $${paramIndex}`;
    //         queryParams.push(`%${searchLoginTerm}%`);
    //         paramIndex++;
    //     }

    //     if (searchEmailTerm) {
    //         sqlQuery += ` ${searchLoginTerm ? 'OR' : 'AND'} email ILIKE $${paramIndex}`;
    //         queryParams.push(`%${searchEmailTerm}%`);
    //         paramIndex++;
    //     }

    //     sqlQuery += `
    //         )
    //         SELECT
    //             filtered_users.*,
    //             COUNT(*) OVER() AS total_count
    //         FROM filtered_users
    //         ORDER BY ${this.sanitizeSortField(query.sortBy)} ${query.sortDirection}
    //         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    //     `;

    //     queryParams.push(query.pageSize, query.calculateSkip());

    //     const result: Array<User & { total_count: string }> =
    //         await this.dataSource.query(sqlQuery, queryParams);

    //     const totalCount = Number(result[0]?.total_count) || 0;
    //     const mappedUsers = result.map((user) => UserViewDto.mapToView(user));

    //     return PaginatedUsersViewDto.mapToView({
    //         items: mappedUsers,
    //         page: query.pageNumber,
    //         size: query.pageSize,
    //         totalCount: totalCount,
    //     });
    // }

    async getAllUsers(
        query: GetUsersQueryParams,
    ): Promise<PaginatedUsersViewDto> {
        const searchLoginTerm = query.searchLoginTerm || null;
        const searchEmailTerm = query.searchEmailTerm || null;

        const qb = this.usersRepo
            .createQueryBuilder('users')
            .where('users.deleted_at IS NULL');

        if (searchLoginTerm && searchEmailTerm) {
            qb.andWhere(
                '(users.login ILIKE :loginTerm OR users.email ILIKE :emailTerm)',
                {
                    loginTerm: `%${searchLoginTerm}%`,
                    emailTerm: `%${searchEmailTerm}%`,
                },
            );
        } else {
            if (searchLoginTerm) {
                qb.andWhere('users.login ILIKE :loginTerm', {
                    loginTerm: `%${searchLoginTerm}%`,
                });
            }

            if (searchEmailTerm) {
                qb.andWhere('users.email ILIKE :emailTerm', {
                    emailTerm: `%${searchEmailTerm}%`,
                });
            }
        }

        const sortField = this.sanitizeSortField(query.sortBy);
        qb.orderBy(
            `users.${sortField}`,
            query.sortDirection.toUpperCase() as 'ASC' | 'DESC',
        );

        qb.skip(query.calculateSkip()).take(query.pageSize);

        const [users, totalCount] = await qb.getManyAndCount();

        const mappedUsers = users.map((user) => UserViewDto.mapToView(user));

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
