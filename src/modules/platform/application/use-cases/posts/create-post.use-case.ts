import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post, PostModelType } from '../../../domain/post.entity';
import { CreatePostDto } from '../../../dto/create';
import { MongoBlogsRepository, PostsRepository } from '../../../infrastructure';

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
        private mongoBlogsRepository: MongoBlogsRepository,
    ) {}

    async execute({ dto }: CreatePostCommand): Promise<string> {
        const blog =
            await this.mongoBlogsRepository.findByIdNonDeletedOrNotFoundFail(
                dto.blogId.toString(), // TODO: remove toString()
            );

        const newPost = this.PostModel.createInstance({
            ...dto,
            blogId: dto.blogId.toString(), // TODO: remove toString()
            blogName: blog.name,
        });

        await this.postsRepository.save(newPost);

        return newPost._id.toString();
    }
}
