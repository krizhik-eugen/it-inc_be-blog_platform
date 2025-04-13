import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from 'src/modules/accounts/domain/user.entity';
export const commentConstraints = {
    content: {
        minLength: 20,
        maxLength: 300,
        errorMessageMinLength:
            'Comment content must be between 20 and 300 characters',
    },
};

@Entity('comments')
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

    @ManyToOne(() => UserEntity, (user) => user.comments, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn({
        name: 'user_id',
    })
    public user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.comments, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn({
        name: 'post_id',
    })
    public post: PostEntity;
}

// export class Comment {
//     id: number;
//     post_id: number;
//     user_id: number;
//     content: string;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: Date | null;
// }

export class CommentWithUserLogin extends CommentEntity {
    user_login: string;
}

export class CommentWithUserLoginAndLikesCount extends CommentEntity {
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
