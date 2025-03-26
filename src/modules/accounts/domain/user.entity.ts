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

export class EmailConfirmation {
    id: number;
    user_id: number;
    confirmation_code: string;
    expiration_date: Date;
    is_confirmed: boolean;
}

export class RecoveryCode {
    id: number;
    user_id: number;
    recovery_code: string;
    expiration_date: Date;
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

// Postgres email_confirmation table:

// CREATE TABLE email_confirmation (
//     id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//     user_id PRIMARY KEY INTEGER NOT NULL,
//     is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
//     confirmation_code VARCHAR(255),
//     expiration_date TIMESTAMP WITH TIME ZONE NULL,

// -- Foreign key to users table
//     CONSTRAINT fk_email_confirmation_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE CASCADE
// );

// Postgres password_recovery table:

// CREATE TABLE password_recovery (

// id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
// user_id PRIMARY KEY INTEGER NOT NULL,
// recovery_code VARCHAR(255),
// expiration_date TIMESTAMP WITH TIME ZONE NULL,

// -- Foreign key to users table
// CONSTRAINT fk_password_recovery_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE CASCADE
// );
