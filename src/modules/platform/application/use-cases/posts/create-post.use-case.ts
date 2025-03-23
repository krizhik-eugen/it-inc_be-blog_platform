import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../../../dto/create';
import { BlogsRepository, PostsRepository } from '../../../infrastructure';

export class CreatePostCommand {
    constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
    implements ICommandHandler<CreatePostCommand, number>
{
    constructor(
        private blogsRepository: BlogsRepository,
        private postsRepository: PostsRepository,
    ) {}

    async execute({ dto }: CreatePostCommand): Promise<number> {
        const blog =
            await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(
                dto.blogId,
            );

        const newPostId = await this.postsRepository.addNewPost({
            ...dto,
            blogName: blog.name,
        });

        return newPostId;
    }
}
