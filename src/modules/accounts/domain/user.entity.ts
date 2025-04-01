import { Column, Entity, OneToOne } from 'typeorm';
import { PasswordRecoveryEntity } from './password-recovery.entity';
import { EmailConfirmationEntity } from './email-confirmation.entity';
import { BaseEntity } from '../../../core/entities/base.entity';

export const userLoginConstraints = {
    minLength: 3,
    maxLength: 10,
    errorMessage: 'Login must be between 3 and 10 symbols',
    pattern: /^[a-zA-Z0-9_-]*$/,
    errorMessagePattern:
        'Login should contain only latin letters, numbers, - and _',
};

export const userPasswordConstraints = {
    minLength: 6,
    maxLength: 20,
    errorMessage: 'Password must be between 6 and 20 symbols',
};

export const userEmailConstraints = {
    pattern: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
    errorMessagePattern:
        'Email should be a valid email address, example: example@example.com',
};

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({
        length: 255,
        unique: true,
    })
    public login: string;

    @Column({
        type: 'text',
    })
    public password_hash: string;

    @Column({
        length: 255,
        unique: true,
    })
    public email: string;

    @OneToOne(
        () => EmailConfirmationEntity,
        (emailConfirmation) => emailConfirmation.user,
    )
    public emailConfirmations: EmailConfirmationEntity;

    @OneToOne(
        () => PasswordRecoveryEntity,
        (passwordRecovery) => passwordRecovery.user,
    )
    public passwordRecoveries: PasswordRecoveryEntity;
}

export class User {
    id: number;
    login: string;
    password_hash: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

// Postgres users table:

// CREATE TABLE users (
//     id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//     login VARCHAR(255) NOT NULL UNIQUE,
//     password_hash TEXT NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     deleted_at TIMESTAMP WITH TIME ZONE NULL
// );
