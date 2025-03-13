export class CreateBlogPostDto {
    title: string;
    shortDescription: string;
    content: string;
}

export class CreatePostDto extends CreateBlogPostDto {
    blogId: number;
}
