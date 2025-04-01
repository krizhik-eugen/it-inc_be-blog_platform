import { Injectable } from '@nestjs/common';
import { Any, DataSource, IsNull, Repository } from 'typeorm';
import { CreateUserDomainDto } from '../../domain/dto/create';
import { User, UserEntity } from '../../domain/user.entity';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfirmationEntity } from '../../domain/email-confirmation.entity';
import { PasswordRecoveryEntity } from '../../domain/password-recovery.entity';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
        @InjectRepository(EmailConfirmationEntity)
        private readonly emailConfirmationsRepo: Repository<EmailConfirmationEntity>,
        @InjectRepository(PasswordRecoveryEntity)
        private readonly passwordRecoveriesRepo: Repository<PasswordRecoveryEntity>,
        private dataSource: DataSource,
    ) {}

    async findById(id: number): Promise<UserEntity | null> {
        const result = await this.usersRepo.findOneBy({
            id,
        });

        return result;
    }

    async findByIdNonDeleted(id: number): Promise<UserEntity | null> {
        const result = await this.usersRepo.findOneBy({
            id,
            deleted_at: IsNull(),
        });

        return result;
    }

    async findByIdOrNotFoundFail(id: number): Promise<UserEntity | null> {
        const result = await this.findById(id);
        if (!result) {
            throw NotFoundDomainException.create('User is not found');
        }
        return result;
    }

    async findByIdNonDeletedOrNotFoundFail(id: number): Promise<UserEntity> {
        const result = await this.findByIdNonDeleted(id);
        if (!result) {
            throw NotFoundDomainException.create('User is not found');
        }
        return result;
    }

    async findUserWithConfirmationStatus(
        userId: number,
    ): Promise<UserEntity | null> {
        const result = await this.usersRepo
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.emailConfirmation', 'e')
            .where('u.id = :userId', { userId })
            .andWhere('u.deleted_at IS NULL')
            .getOne();

        return result;
    }

    async findByEmailWithConfirmationStatusNonDeleted(
        email: string,
    ): Promise<UserEntity | null> {
        const result = await this.usersRepo
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.emailConfirmation', 'e')
            .where('u.email = :email', { email })
            .andWhere('u.deleted_at IS NULL')
            .getOne();

        return result;
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null> {
        const result = await this.usersRepo
            .createQueryBuilder('u')
            .where('u.login = :loginOrEmail OR u.email = :loginOrEmail', {
                loginOrEmail,
            })
            .andWhere('u.deleted_at IS NULL')
            .getOne();

        return result;
    }

    async findByIds(ids: number[]): Promise<UserEntity[]> {
        const result = await this.usersRepo.findBy({
            id: Any(ids),
            deleted_at: IsNull(),
        });
        return result;
    }

    async addNewUser({
        login,
        email,
        passwordHash,
    }: CreateUserDomainDto): Promise<number> {
        // const data: { id: number }[] = await this.dataSource.query(
        //     `
        //         WITH new_user AS (
        //         INSERT INTO public.users (login, email, password_hash)
        //         VALUES ($1, $2, $3)
        //         RETURNING id
        //         ),
        //         email_confirmation AS (
        //         INSERT INTO public.email_confirmation (user_id, confirmation_code, expiration_date)
        //         SELECT id, NULL, NULL FROM new_user
        //         ),
        //         password_recovery AS (
        //         INSERT INTO public.password_recovery (user_id, recovery_code, expiration_date)
        //         SELECT id, NULL, NULL FROM new_user
        //         )
        //         SELECT id FROM new_user
        //         `,
        //     [login, email, passwordHash],
        // );

        // return data[0].id;

        // Create a query runner for transaction management
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Insert new user using queryBuilder instead of repository
            const userInsertResult = await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('users')
                .values({
                    login,
                    email,
                    password_hash: passwordHash,
                })
                .returning('id')
                .execute();

            const userId = (userInsertResult.raw[0] as { id: number }).id;

            // Insert email confirmation directly
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('email_confirmation') // Using the table name directly
                .values({
                    user_id: userId,
                    confirmation_code: null,
                    expiration_date: null,
                    is_confirmed: false,
                })
                .execute();

            // Insert password recovery directly
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('password_recovery') // Using the table name directly
                .values({
                    user_id: userId,
                    recovery_code: null,
                    expiration_date: null,
                })
                .execute();

            await queryRunner.commitTransaction();

            return userId;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateUserEmail(id: number, email: string): Promise<void> {
        await this.findByIdNonDeletedOrNotFoundFail(id);
        // await this.usersRepo
        //     .createQueryBuilder()
        //     .update({ email })
        //     .where('id = :id', { id })
        //     .execute();

        await this.usersRepo.update(id, { email });
    }

    async updateUserIsConfirmed(
        id: number,
        isConfirmed: boolean,
    ): Promise<void> {
        await this.findByIdNonDeletedOrNotFoundFail(id);
        // await this.emailConfirmationsRepo
        //     .createQueryBuilder()
        //     .update({ is_confirmed: isConfirmed })
        //     .where('user_id = :id', { id })
        //     .execute();

        await this.emailConfirmationsRepo.update(id, {
            is_confirmed: isConfirmed,
        });
    }

    async setConfirmationCode(
        user_id: number,
        code: string,
        expirationDate: Date,
    ): Promise<void> {
        // await this.emailConfirmationsRepo
        //     .createQueryBuilder()
        //     .update({
        //         confirmation_code: code,
        //         expiration_date: expirationDate,
        //     })
        //     .where('user_id = :user_id', { user_id })
        //     .execute();

        await this.emailConfirmationsRepo.update(user_id, {
            confirmation_code: code,
            expiration_date: expirationDate,
        });
    }

    async setPasswordRecoveryCode(
        user_id: number,
        code: string,
        expirationDate: Date,
    ): Promise<void> {
        // await this.passwordRecoveriesRepo
        //     .createQueryBuilder()
        //     .update({
        //         recovery_code: code,
        //         expiration_date: expirationDate,
        //     })
        //     .where('user_id = :user_id', { user_id })
        //     .execute();

        await this.passwordRecoveriesRepo.update(user_id, {
            recovery_code: code,
            expiration_date: expirationDate,
        });
    }

    async makeUserDeletedById(id: number): Promise<void> {
        const user = await this.findByIdOrNotFoundFail(id);
        if (user?.deleted_at) {
            throw NotFoundDomainException.create('Entity is already deleted');
        }
        await this.usersRepo.softDelete(id);
    }

    async findUserByConfirmationCode(
        confirmationCode: string,
    ): Promise<UserEntity | null> {
        const result = await this.usersRepo
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.emailConfirmation', 'e')
            .where('e.confirmation_code = :confirmationCode', {
                confirmationCode,
            })
            .andWhere('u.deleted_at IS NULL')
            .getOne();

        return result;
    }

    async findUserByRecoveryCodeOrNotFoundFail(
        recoveryCode: string,
    ): Promise<UserEntity> {
        // const result: UserEntity[] = await this.dataSource.query(
        //     `
        //         WITH recovery_code AS (
        //             SELECT * FROM password_recovery
        //             WHERE recovery_code = $1
        //         )
        //         SELECT * FROM users
        //         WHERE id = (SELECT user_id FROM recovery_code)
        //         AND deleted_at IS NULL
        //     `,
        //     [recoveryCode],
        // );

        const result = await this.usersRepo
            .createQueryBuilder('u')
            .innerJoin(PasswordRecoveryEntity, 'pr', 'u.id = pr.user_id')
            .where('pr.recovery_code = :recoveryCode', { recoveryCode })
            .andWhere('u.deleted_at IS NULL')
            .getOne();

        if (!result) {
            throw NotFoundDomainException.create(
                'No user found for this recovery code',
            );
        }

        return result;
    }

    async changeUserPasswordById(
        userId: number,
        newPasswordHash: string,
    ): Promise<void> {
        // await this.dataSource.query(
        //     `
        //         UPDATE users
        //         SET password_hash = $1
        //         WHERE id = $2 AND deleted_at IS NULL
        //     `,
        //     [newPasswordHash, userId],
        // );

        await this.usersRepo.update(userId, { password_hash: newPasswordHash });
    }
}
