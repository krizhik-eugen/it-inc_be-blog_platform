import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}

export enum LikeParentType {
    Post = 'post',
    Comment = 'comment',
}

@Entity('likes')
export class LikeEntity extends BaseEntity {
    @Column({
        type: 'integer',
        nullable: false,
    })
    parent_id: number;

    @Column({
        type: 'varchar',
        length: 10,
        nullable: false,
    })
    parent_type: LikeParentType;

    @Column({
        type: 'integer',
        nullable: false,
    })
    user_id: number;

    @Column({
        type: 'enum',
        enum: LikeStatus,
        nullable: false,
        default: LikeStatus.None,
    })
    status: LikeStatus;

    // @ManyToOne(() => PostEntity, { nullable: true })
    // @JoinColumn({ name: 'parent_id' })
    // post?: PostEntity;

    // @ManyToOne(() => CommentEntity, { nullable: true })
    // @JoinColumn({ name: 'parent_id' })
    // comment?: CommentEntity;

    // @ManyToOne(() => UserEntity)
    // @JoinColumn({ name: 'user_id' })
    // user: UserEntity;
}

// export class Like {
//     id: number;
//     parent_id: number;
//     parent_type: LikeParentType;
//     user_id: number;
//     status: LikeStatus;
//     created_at: Date;
//     updated_at: Date;
//     deleted_at: Date | null;
// }

//Postgres likes table:

//
// CREATE TABLE "public"."likes" (
//     "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//     "parent_id" integer NOT NULL,
//     "parent_type" varchar(10) NOT NULL,
//     "user_id" integer NOT NULL,
//     "status" like_status NOT NULL,
//     "created_at" timestamp with time zone DEFAULT NOW(),
//     "updated_at" timestamp with time zone DEFAULT NOW(),
//     "deleted_at" timestamp with time zone,
//     CONSTRAINT "check_parent_type" CHECK ("parent_type" IN ('post', 'comment')),
//     CONSTRAINT "fk_like_user" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id")
//   )
