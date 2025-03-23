// export class CreateCommentDomainDto {
//     content: string;
//     postId: string;
//     commentatorInfo: {
//         userId: number;
//         userLogin: string;
//     };
// }

export class CreateCommentDomainDto {
    content: string;
    postId: number;
    userId: number;
}
