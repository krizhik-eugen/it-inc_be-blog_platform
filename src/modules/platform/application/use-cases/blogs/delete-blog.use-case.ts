import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure/repositories/blogs.repository';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';

export class DeleteBlogCommand {
    constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
    implements ICommandHandler<DeleteBlogCommand, void>
{
    constructor(
        private blogsRepository: BlogsRepository,
        private postsRepository: PostsRepository,
        private commentsRepository: CommentsRepository,
    ) {}

    async execute({ blogId }: DeleteBlogCommand): Promise<void> {
        const blog =
            await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(blogId);

        blog.makeDeleted();

        await this.blogsRepository.save(blog);

        //TODO: check if possible to do the following actions with commands
        // Removing all posts for this blog and their comments
        const posts =
            await this.postsRepository.findAllByBlogIdNonDeleted(blogId);
        const postIds = posts.map((p) => p._id.toString());
        await this.commentsRepository.deleteAllByPostIds(postIds);
        await this.postsRepository.deleteAllByBlogId(blogId);
        //TODO: handle likes removing
    }
}
