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

export class Post {
    id: number;
    title: string;
    short_description: string;
    content: string;
    blog_id: number;
    blog_name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export class PostWithLikesCount extends Post {
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
