export class PostgresSession {
    id: number;
    user_id: number;
    device_id: string;
    device_name: string;
    ip: string;
    iat: number;
    exp: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

//Postgres sessions table:

// CREATE TABLE sessions (
//     id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//     user_id INTEGER NOT NULL,
//     device_id VARCHAR(255) NOT NULL,
//     device_name VARCHAR(255) NOT NULL DEFAULT 'Unknown device',
//     ip VARCHAR(45) NOT NULL,  -- IPv6 addresses can be up to 45 chars
//     iat BIGINT NOT NULL,      -- issued at timestamp
//     exp BIGINT NOT NULL,      -- expiration timestamp
//     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     deleted_at TIMESTAMP WITH TIME ZONE NULL,

//     -- Foreign key to users table
//     CONSTRAINT fk_sessions_user FOREIGN KEY (user_id)
//         REFERENCES users(id) ON DELETE CASCADE
// );
