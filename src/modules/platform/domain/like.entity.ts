export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}

export enum LikeParentType {
    Post = 'post',
    Comment = 'comment',
}

export class Like {
    id: number;
    parent_id: number;
    parent_type: LikeParentType;
    user_id: number;
    status: LikeStatus;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

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
