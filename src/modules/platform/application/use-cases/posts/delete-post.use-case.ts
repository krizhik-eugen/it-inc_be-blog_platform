import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';

export class DeletePostCommand {
    constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
    implements ICommandHandler<DeletePostCommand, void>
{
    constructor(private postsRepository: PostsRepository) {}

    async execute({ postId }: DeletePostCommand): Promise<void> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);

        post.makeDeleted();

        await this.postsRepository.save(post);
    }
}
