import { Column } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';
export const commentConstraints = {
    content: {
        minLength: 20,
        maxLength: 300,
        errorMessageMinLength:
            'Comment content must be between 20 and 300 characters',
    },
};

export class CommentEntity extends BaseEntity {
    @Column({
        type: 'integer',
        nullable: false,
    })
    public post_id: number;

    @Column({
        type: 'integer',
        nullable: false,
    })
    public user_id: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    public content: string;
}

export class Comment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export class CommentWithUserLogin extends Comment {
    user_login: string;
}

export class CommentWithUserLoginAndLikesCount extends Comment {
    user_login: string;
    likes_count: number;
    dislikes_count: number;
}

// Postgres comments table:

// CREATE TABLE comments (
//     id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//     post_id INTEGER NOT NULL,
//     content VARCHAR(350) NOT NULL,
//     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
//     deleted_at TIMESTAMP WITH TIME ZONE
// );

// -- Foreign key to posts table
// CONSTRAINT fk_comments_posts FOREIGN KEY (post_id) REFERENCES public.posts (id) ON UPDATE NO ACTION ON DELETE CASCADE

// -- Foreign key to users table
// CONSTRAINT fk_comments_users FOREIGN KEY (user_id) REFERENCES public.users (id) ON UPDATE NO ACTION ON DELETE CASCADE
