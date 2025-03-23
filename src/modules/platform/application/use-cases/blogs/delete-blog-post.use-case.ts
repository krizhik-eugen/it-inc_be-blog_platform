import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository, PostsRepository } from '../../../infrastructure';

export class DeleteBlogPostCommand {
    constructor(
        public postId: number,
        public blogId: number,
    ) {}
}

@CommandHandler(DeleteBlogPostCommand)
export class DeleteBlogPostUseCase
    implements ICommandHandler<DeleteBlogPostCommand, void>
{
    constructor(
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
        // private commentsRepository: CommentsRepository,
        // private likesRepository: LikesRepository,
    ) {}

    async execute({ postId, blogId }: DeleteBlogPostCommand): Promise<void> {
        await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(blogId);

        await this.postsRepository.makePostDeletedById(postId);

        // TODO: delete comments and likes
        // const comments =
        //     await this.commentsRepository.findAllByPostIdNonDeleted(postId);
        // const commentIds = comments.map((c) => c._id.toString());
        // await this.commentsRepository.deleteAllByPostId(postId);
        // await this.likesRepository.deleteAllByParentIds(commentIds);
    }
}
