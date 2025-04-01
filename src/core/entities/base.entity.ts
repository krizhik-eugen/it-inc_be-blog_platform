import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('identity')
    public id: number;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
    })
    public created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
    })
    public updated_at: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        nullable: true,
    })
    public deleted_at: Date | null;
}
