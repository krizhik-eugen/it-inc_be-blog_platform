import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post, PostModelType } from '../../../domain/post.entity';
import { CreatePostDto } from '../../../dto/create';
import { BlogsRepository, PostsRepository } from '../../../infrastructure';

export class CreatePostCommand {
    constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
    implements ICommandHandler<CreatePostCommand, string>
{
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
    ) {}

    async execute({ dto }: CreatePostCommand): Promise<string> {
        const blog =
            await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(
                dto.blogId,
            );

        const newPost = this.PostModel.createInstance({
            ...dto,
            blogName: blog.name,
        });

        await this.postsRepository.save(newPost);

        return newPost._id.toString();
    }
}
