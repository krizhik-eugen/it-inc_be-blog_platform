import { BlogsRepository } from '../../../infrastructure/repositories/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteBlogCommand {
    constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
    implements ICommandHandler<DeleteBlogCommand, void>
{
    constructor(private blogsRepository: BlogsRepository) {}

    async execute({ blogId }: DeleteBlogCommand): Promise<void> {
        const blog =
            await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(blogId);

        blog.makeDeleted();

        await this.blogsRepository.save(blog);
    }
}
