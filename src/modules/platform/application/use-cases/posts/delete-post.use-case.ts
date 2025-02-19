import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository, PostsRepository } from '../../../infrastructure';

export class DeletePostCommand {
    constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
    implements ICommandHandler<DeletePostCommand, void>
{
    constructor(
        private postsRepository: PostsRepository,
        private commentsRepository: CommentsRepository,
    ) {}

    async execute({ postId }: DeletePostCommand): Promise<void> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);

        post.makeDeleted();

        await this.postsRepository.save(post);

        //TODO: check if possible to do the following actions with events
        //Removing all comments for this post
        await this.commentsRepository.deleteAllByPostId(postId);
        //TODO: Handle likes removing
    }
}
