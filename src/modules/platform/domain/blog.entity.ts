import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';
import { PostEntity } from './post.entity';

export const blogConstraints = {
    name: {
        maxLength: 15,
    },
    description: {
        maxLength: 500,
    },
    websiteUrl: {
        pattern:
            /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
        errorMessagePattern: 'Website URL should be a valid URL',
        maxLength: 100,
    },
};

@Entity('blogs')
export class BlogEntity extends BaseEntity {
    @Column({
        length: 255,
    })
    public name: string;

    @Column({
        type: 'text',
    })
    public description: string;

    @Column({
        length: 255,
    })
    public website_url: string;

    @Column({
        type: 'boolean',
        default: false,
    })
    public is_membership: boolean;

    @OneToMany(() => PostEntity, (post) => post.blog, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    })
    public posts: PostEntity[];
}

// export class Blog {
//     id: number;
//     name: string;
//     description: string;
//     website_url: string;
//     is_membership: boolean;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: Date | null;
// }

// Postgres blogs table:

// CREATE TABLE blogs (
//     id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//     name VARCHAR(255) NOT NULL,
//     description VARCHAR(555) NOT NULL,
//     website_url VARCHAR(255) NOT NULL,
//     is_membership BOOLEAN NOT NULL DEFAULT FALSE,
//     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     deleted_at TIMESTAMP WITH TIME ZONE
// );
