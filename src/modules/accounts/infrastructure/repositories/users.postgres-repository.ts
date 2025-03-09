import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDomainDto } from '../../domain/dto/create';
import { PostgresUser } from '../../domain/user.postgres-entity';
import { NotFoundDomainException } from '../../../../core/exceptions';

@Injectable()
export class UsersPostgresRepository {
    constructor(private dataSource: DataSource) {}

    async findById(id: number): Promise<PostgresUser | null> {
        const data: PostgresUser[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE id = $1
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByIdNonDeleted(id: number): Promise<PostgresUser | null> {
        const data: PostgresUser[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByIdOrNotFoundFail(id: number): Promise<PostgresUser> {
        const user = await this.findById(id);
        if (!user) {
            throw NotFoundDomainException.create('PostgresUser is not found');
        }
        return user;
    }

    async findByIdNonDeletedOrNotFoundFail(id: number): Promise<PostgresUser> {
        const user = await this.findByIdNonDeleted(id);
        if (!user) {
            throw NotFoundDomainException.create('PostgresUser is not found');
        }
        return user;
    }

    async findByLoginOrEmail(
        loginOrEmail: string,
    ): Promise<PostgresUser | null> {
        const data: PostgresUser[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE login = $1 OR email = $1 AND deleted_at IS NULL
                `,
            [loginOrEmail],
        );

        return data[0] || null;
    }

    async findByLoginOrEmailNonDeleted(
        loginOrEmail: string,
    ): Promise<PostgresUser | null> {
        const data: PostgresUser[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE login = $1 OR email = $1 AND deleted_at IS NULL
                `,
            [loginOrEmail],
        );

        return data[0] || null;
    }

    async findByLoginOrEmailNonDeletedOrNotFoundFail(
        loginOrEmail: string,
    ): Promise<PostgresUser> {
        const user = await this.findByLoginOrEmailNonDeleted(loginOrEmail);
        if (!user) {
            throw NotFoundDomainException.create('PostgresUser is not found');
        }
        return user;
    }

    async findByIds(ids: number[]): Promise<PostgresUser[]> {
        const data: PostgresUser[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE id = ANY($1)
                AND deleted_at IS NULL
                `,
            [ids],
        );

        return data;
    }

    async addNewUser({
        login,
        email,
        passwordHash,
    }: CreateUserDomainDto): Promise<number> {
        const data: { id: number }[] = await this.dataSource.query(
            `
                WITH new_user AS (
                INSERT INTO public.users (login, email, password_hash)
                VALUES ($1, $2, $3)
                RETURNING id
                ),
                email_confirmation AS (
                INSERT INTO public.email_confirmation (user_id, confirmation_code, expiration_date)
                SELECT id, NULL, NULL FROM new_user
                ),
                password_recovery AS (
                INSERT INTO public.password_recovery (user_id, recovery_code, expiration_date)
                SELECT id, NULL, NULL FROM new_user
                )
                SELECT id FROM new_user
                `,
            [login, email, passwordHash],
        );

        console.log('data', data);

        return data[0].id;
    }

    async updateUserEmail(id: number, email: string): Promise<void> {
        await this.findByIdNonDeletedOrNotFoundFail(id);
        await this.dataSource.query(
            `
                UPDATE public.users
                SET email = $1, updated_at = NOW()
                WHERE id = $2
                `,
            [email, id],
        );
    }

    async updateUserIsConfirmed(
        id: number,
        isConfirmed: boolean,
    ): Promise<void> {
        await this.findByIdNonDeletedOrNotFoundFail(id);
        await this.dataSource.query(
            `
                UPDATE public.email_confirmation
                SET is_confirmed = $1, updated_at = NOW()
                WHERE user_id = $2
                `,
            [isConfirmed, id],
        );
    }

    async makeUserDeletedById(id: number): Promise<void> {
        const user = await this.findById(id);
        if (user?.deleted_at) {
            throw NotFoundDomainException.create('Entity is already deleted');
        }
        await this.dataSource.query(
            `
                UPDATE public.users
                SET deleted_at = NOW()
                WHERE id = $1 AND deleted_at IS NULL
                RETURNING id
                `,
            [id],
        );
    }
}
