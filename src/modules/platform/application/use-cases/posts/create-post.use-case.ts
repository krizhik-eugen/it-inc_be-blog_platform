import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../../../dto/create';
import {
    PostgresBlogsRepository,
    PostgresPostsRepository,
} from '../../../infrastructure';

export class CreatePostCommand {
    constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
    implements ICommandHandler<CreatePostCommand, number>
{
    constructor(
        // @InjectModel(MongoPost.name)
        // private PostModel: MongoPostModelType,
        // private mongoPostsRepository: MongoPostsRepository,
        // private mongoBlogsRepository: MongoBlogsRepository,
        private postgresBlogsRepository: PostgresBlogsRepository,
        private postgresPostsRepository: PostgresPostsRepository,
    ) {}

    async execute({ dto }: CreatePostCommand): Promise<number> {
        const blog =
            await this.postgresBlogsRepository.findByIdNonDeletedOrNotFoundFail(
                dto.blogId,
            );

        const newPostId = await this.postgresPostsRepository.addNewPost({
            ...dto,
            blogName: blog.name,
        });

        return newPostId;

        // const newPost = this.PostModel.createInstance({
        //     ...dto,
        //     blogId: dto.blogId,
        //     blogName: blog.name,
        // });

        // await this.mongoPostsRepository.save(newPost);

        // return newPost._id.toString();
    }
}
