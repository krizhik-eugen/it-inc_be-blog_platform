export class CreateCommentDomainDto {
    content: string;
    postId: string;
    commentatorInfo: {
        userId: number;
        userLogin: string;
    };
}
