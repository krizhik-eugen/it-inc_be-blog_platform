import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    BlogsRepository,
    CommentsRepository,
    LikesRepository,
    PostsRepository,
} from '../../../infrastructure';

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
        private likesRepository: LikesRepository,
    ) {}

    async execute({ blogId }: DeleteBlogCommand): Promise<void> {
        const blog =
            await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(blogId);

        blog.makeDeleted();

        await this.blogsRepository.save(blog);

        const posts =
            await this.postsRepository.findAllByBlogIdNonDeleted(blogId);
        const postIds = posts.map((p) => p._id.toString());
        const comments =
            await this.commentsRepository.findAllByPostIdsNonDeleted(postIds);
        const commentIds = comments.map((c) => c._id.toString());
        await this.commentsRepository.deleteAllByPostIds(postIds);
        await this.postsRepository.deleteAllByBlogId(blogId);
        await this.likesRepository.deleteAllByParentIds([
            ...postIds,
            ...commentIds,
        ]);
    }
}
