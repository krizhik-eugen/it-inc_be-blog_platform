export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}

export type NewestLikes = {
    addedAt: string;
    userId: string;
    login: string;
}[];
