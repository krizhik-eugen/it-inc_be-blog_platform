import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure';

export class DeleteBlogCommand {
    constructor(public blogId: number) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
    implements ICommandHandler<DeleteBlogCommand, void>
{
    constructor(private blogsRepository: BlogsRepository) {}

    async execute({ blogId }: DeleteBlogCommand): Promise<void> {
        await this.blogsRepository.makeBlogDeletedById(blogId);

        // TODO: delete all posts associated with the blog, comments for these posts, likes for posts and comments

        // const posts =
        //     await this.mongoPostsQueryRepository.findAllByBlogIdNonDeleted(blogId);
        // const postIds = posts.map((p) => p._id.toString());
        // const comments =
        //     await this.commentsRepository.findAllByPostIdsNonDeleted(postIds);
        // const commentIds = comments.map((c) => c._id.toString());
        // await this.commentsRepository.deleteAllByPostIds(postIds);
        // await this.mongoPostsQueryRepository.deleteAllByBlogId(blogId);
        // await this.likesRepository.deleteAllByParentIds([
        //     ...postIds,
        //     ...commentIds,
        // ]);
    }
}
