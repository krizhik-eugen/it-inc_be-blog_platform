import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('email_confirmation')
export class EmailConfirmationEntity {
    @PrimaryGeneratedColumn('identity')
    public id: number;

    @Column()
    public user_id: number;

    @Column({
        length: 255,
        nullable: true,
    })
    public confirmation_code: string;

    @Column({
        type: 'timestamptz',
        nullable: true,
    })
    public expiration_date: Date;

    @Column({
        default: false,
    })
    public is_confirmed: boolean;

    @OneToOne(() => UserEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'user_id',
    })
    public user: UserEntity;
}

export class EmailConfirmation {
    id: number;
    user_id: number;
    confirmation_code: string;
    expiration_date: Date;
    is_confirmed: boolean;
}

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
