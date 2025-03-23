import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository, PostsRepository } from '../../../infrastructure';
import { UpdatePostDto } from '../../../dto/update';

export class UpdateBlogPostCommand {
    constructor(
        public postId: number,
        public blogId: number,
        public dto: UpdatePostDto,
    ) {}
}

@CommandHandler(UpdateBlogPostCommand)
export class UpdateBlogPostUseCase
    implements ICommandHandler<UpdateBlogPostCommand, void>
{
    constructor(
        private blogsRepository: BlogsRepository,
        private postsRepository: PostsRepository,
    ) {}

    async execute({
        postId,
        blogId,
        dto,
    }: UpdateBlogPostCommand): Promise<void> {
        await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(blogId);
        await this.postsRepository.updatePostById(postId, dto);
    }
}
