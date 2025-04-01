import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

// Password Recovery Entity
@Entity('password_recovery')
export class PasswordRecoveryEntity {
    @PrimaryGeneratedColumn('identity')
    public id: number;

    @Column()
    public user_id: number;

    @Column({
        length: 255,
        nullable: true,
    })
    public recovery_code: string;

    @Column({
        type: 'timestamptz',
        nullable: true,
    })
    public expiration_date: Date;

    @OneToOne(() => UserEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'user_id',
    })
    public user: UserEntity;
}

export class RecoveryCode {
    id: number;
    user_id: number;
    recovery_code: string;
    expiration_date: Date;
}

// Postgres password_recovery table:

// CREATE TABLE password_recovery (

// id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
// user_id PRIMARY KEY INTEGER NOT NULL,
// recovery_code VARCHAR(255),
// expiration_date TIMESTAMP WITH TIME ZONE NULL,

// -- Foreign key to users table
// CONSTRAINT fk_password_recovery_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE CASCADE
// );
