import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';

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
