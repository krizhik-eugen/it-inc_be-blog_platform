import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    CommentsRepository,
    LikesRepository,
    PostsRepository,
} from '../../../infrastructure';

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
        private likesRepository: LikesRepository,
    ) {}

    async execute({ postId }: DeletePostCommand): Promise<void> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);

        post.makeDeleted();

        await this.postsRepository.save(post);

        const comments =
            await this.commentsRepository.findAllByPostIdNonDeleted(postId);
        const commentIds = comments.map((c) => c._id.toString());
        await this.commentsRepository.deleteAllByPostId(postId);
        await this.likesRepository.deleteAllByParentIds(commentIds);
    }
}
