import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';
import { BlogEntity } from './blog.entity';

export const postConstraints = {
    title: {
        maxLength: 30,
    },
    shortDescription: {
        maxLength: 100,
    },
    content: {
        maxLength: 1000,
    },
};

@Entity('posts')
export class PostEntity extends BaseEntity {
    @Column({
        length: 255,
    })
    public title: string;

    @Column({
        length: 255,
    })
    public short_description: string;

    @Column({
        type: 'text',
    })
    public content: string;

    @Column({
        type: 'integer',
    })
    public blog_id: number;

    @Column({
        length: 255,
    })
    public blog_name: string;

    @ManyToOne(() => BlogEntity, (blog) => blog.posts, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    })
    public blog: BlogEntity;
}

// export class Post {
//     id: number;
//     title: string;
//     short_description: string;
//     content: string;
//     blog_id: number;
//     blog_name: string;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: Date | null;
// }

export class PostWithLikesCount extends PostEntity {
    likes_count: number;
    dislikes_count: number;
}

// Postgres posts table:

// CREATE TABLE posts (
//     id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//     title VARCHAR(255) NOT NULL,
//     short_description VARCHAR(255) NOT NULL,
//     content VARCHAR(1023) NOT NULL,
//     blog_id INTEGER NOT NULL,
//     blog_name VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     deleted_at TIMESTAMP WITH TIME ZONE

// -- Foreign key to blogs table
//     CONSTRAINT fk_posts_blogs FOREIGN KEY (blog_id) REFERENCES public.blogs (id) ON UPDATE NO ACTION ON DELETE CASCADE
// );
