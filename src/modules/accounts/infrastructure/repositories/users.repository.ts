import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In, IsNull, Repository } from 'typeorm';
import { CreateUserDomainDto } from '../../domain/dto/create';
import { UserEntity } from '../../domain/user.entity';
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
            .leftJoinAndSelect('u.emailConfirmations', 'e')
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
            .leftJoinAndSelect('u.emailConfirmations', 'e')
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
            id: In(ids),
            deleted_at: IsNull(),
        });
        return result;
    }

    async addNewUser({
        login,
        email,
        passwordHash,
    }: CreateUserDomainDto): Promise<number> {
        const newUserId = await this.dataSource.manager.transaction(
            async (entityManager: EntityManager) => {
                const user = entityManager.create(UserEntity, {
                    login,
                    email,
                    password_hash: passwordHash,
                });

                const savedUser = await entityManager.save(user);

                const emailConfirmation = entityManager.create(
                    EmailConfirmationEntity,
                    {
                        user: savedUser,
                    },
                );

                const passwordRecovery = entityManager.create(
                    PasswordRecoveryEntity,
                    {
                        user: savedUser,
                    },
                );

                await entityManager.save(emailConfirmation);
                await entityManager.save(passwordRecovery);

                return savedUser.id;
            },
        );

        return newUserId;
    }

    async updateUserEmail(id: number, email: string): Promise<void> {
        await this.findByIdNonDeletedOrNotFoundFail(id);

        await this.usersRepo.update(id, { email });
    }

    async updateUserIsConfirmed(
        id: number,
        isConfirmed: boolean,
    ): Promise<void> {
        await this.findByIdNonDeletedOrNotFoundFail(id);

        await this.emailConfirmationsRepo.update(id, {
            is_confirmed: isConfirmed,
        });
    }

    async setConfirmationCode(
        user_id: number,
        code: string,
        expirationDate: Date,
    ): Promise<void> {
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
            .leftJoinAndSelect('u.emailConfirmations', 'e')
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
        await this.usersRepo.update(userId, { password_hash: newPasswordHash });
    }
}
