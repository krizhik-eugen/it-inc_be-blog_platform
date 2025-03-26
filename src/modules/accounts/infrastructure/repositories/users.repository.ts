import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDomainDto } from '../../domain/dto/create';
import { EmailConfirmation, User } from '../../domain/user.entity';
import { NotFoundDomainException } from '../../../../core/exceptions';

@Injectable()
export class UsersRepository {
    constructor(private dataSource: DataSource) {}

    async findById(id: number): Promise<User | null> {
        const data: User[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE id = $1
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByIdNonDeleted(id: number): Promise<User | null> {
        const data: User[] = await this.dataSource.query(
            `
                SELECT * FROM public.users
                WHERE id = $1 AND deleted_at IS NULL
                `,
            [id],
        );

        return data[0] || null;
    }

    async findByIdOrNotFoundFail(id: number): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw NotFoundDomainException.create('User is not found');
        }
        return user;
    }

    async findByIdNonDeletedOrNotFoundFail(id: number): Promise<User> {
        const user = await this.findByIdNonDeleted(id);
        if (!user) {
            throw NotFoundDomainException.create('User is not found');
        }
        return user;
    }

    async findUserWithConfirmationStatus(
        userId: number,
    ): Promise<(User & EmailConfirmation) | null> {
        const result: Array<EmailConfirmation & User> =
            await this.dataSource.query(
                `
                SELECT u.*, e.* FROM public.users u
                JOIN public.email_confirmation e ON u.id = e.user_id
                WHERE u.id = $1 AND u.deleted_at IS NULL
                `,
                [userId],
            );

        return result[0] || null;
    }

    async findByEmailWithConfirmationStatusNonDeleted(
        email: string,
    ): Promise<(User & EmailConfirmation) | null> {
        const data: (User & EmailConfirmation)[] = await this.dataSource.query(
            `
                SELECT u.*, e.* FROM public.users u
                JOIN public.email_confirmation e ON u.id = e.user_id
                WHERE u.email = $1 AND u.deleted_at IS NULL
                `,
            [email],
        );

        return data[0] || null;
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        const data: User[] = await this.dataSource.query(
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
    ): Promise<User | null> {
        const data: User[] = await this.dataSource.query(
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
    ): Promise<User> {
        const user = await this.findByLoginOrEmailNonDeleted(loginOrEmail);
        if (!user) {
            throw NotFoundDomainException.create('User is not found');
        }
        return user;
    }

    async findByIds(ids: number[]): Promise<User[]> {
        const data: User[] = await this.dataSource.query(
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
                SET is_confirmed = $1
                WHERE user_id = $2
                `,
            [isConfirmed, id],
        );
    }

    async setConfirmationCode(
        user_id: number,
        code: string,
        expirationDate: Date,
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE public.email_confirmation
                SET confirmation_code = $1, expiration_date = $2
                WHERE user_id = $3
                `,
            [code, expirationDate, user_id],
        );
    }

    async setPasswordRecoveryCode(
        user_id: number,
        code: string,
        expirationDate: Date,
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE public.password_recovery
                SET recovery_code = $1, expiration_date = $2
                WHERE user_id = $3
                `,
            [code, expirationDate, user_id],
        );
    }

    async makeUserDeletedById(id: number): Promise<void> {
        const user = await this.findByIdOrNotFoundFail(id);
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

    async findUserByConfirmationCode(
        confirmationCode: string,
    ): Promise<(User & EmailConfirmation) | null> {
        const result: (User & EmailConfirmation)[] =
            await this.dataSource.query(
                `
            SELECT u.*, e.* FROM users u
            JOIN email_confirmation e ON u.id = e.user_id
            WHERE e.confirmation_code = $1 AND u.deleted_at IS NULL
            `,
                [confirmationCode],
            );

        return result[0] || null;
    }

    async findUserByRecoveryCodeOrNotFoundFail(
        recoveryCode: string,
    ): Promise<User> {
        const result: User[] = await this.dataSource.query(
            `
                WITH recovery_code AS (
                    SELECT * FROM password_recovery
                    WHERE recovery_code = $1
                )
                SELECT * FROM users
                WHERE id = (SELECT user_id FROM recovery_code)
                AND deleted_at IS NULL
            `,
            [recoveryCode],
        );

        if (!result[0]) {
            throw NotFoundDomainException.create(
                'No user found for this recovery code',
            );
        }

        return result[0];
    }

    async changeUserPasswordById(
        userId: number,
        newPasswordHash: string,
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE users
                SET password_hash = $1
                WHERE id = $2 AND deleted_at IS NULL
            `,
            [newPasswordHash, userId],
        );
    }
}
