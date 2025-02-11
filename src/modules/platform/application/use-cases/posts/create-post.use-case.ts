import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post, PostModelType } from '../../../domain/post.entity';
import { CreatePostDto } from '../../../dto/create/create-post.dto';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';
import { BlogsRepository } from '../../../infrastructure/repositories/blogs.repository';

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

        const post = this.PostModel.createInstance({
            ...dto,
            blogName: blog.name,
        });

        await this.postsRepository.save(post);

        return post._id.toString();
    }
}
