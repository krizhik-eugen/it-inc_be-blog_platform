export class PostgresEmailConfirmation {
    id: number;
    user_id: number;
    confirmation_code: string;
    expiration_date: Date;
    is_confirmed: boolean;
}

export class PostgresRecoveryCode {
    id: number;
    user_id: number;
    recovery_code: string;
    expiration_date: Date;
}

export class PostgresUser {
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
//     user_id INTEGER NOT NULL,
//     is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
//     confirmation_code VARCHAR(255),
//     expiration_date TIMESTAMP WITH TIME ZONE NULL,
//     CONSTRAINT fk_email_confirmation_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE CASCADE
// );

// Postgres password_recovery table:

// CREATE TABLE password_recovery (

// id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
// user_id INTEGER NOT NULL,
// recovery_code VARCHAR(255),
// expiration_date TIMESTAMP WITH TIME ZONE NULL,
// CONSTRAINT fk_password_recovery_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE CASCADE
// );
