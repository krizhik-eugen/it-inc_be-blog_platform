import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    PostgresBlogsRepository,
    PostgresPostsRepository,
} from '../../../infrastructure';
import { UpdatePostDto } from '../../../dto/update';

export class UpdateBlogPostCommand {
    constructor(
        public postId: number,
        public blogId: number,
        public dto: UpdatePostDto,
    ) {}
}

@CommandHandler(UpdateBlogPostCommand)
export class UpdateBlogPostUseCase
    implements ICommandHandler<UpdateBlogPostCommand, void>
{
    constructor(
        // private mongoPostsRepository: MongoPostsRepository,
        private postgresBlogsRepository: PostgresBlogsRepository,
        private postgresPostsRepository: PostgresPostsRepository,
    ) {}

    async execute({
        postId,
        blogId,
        dto,
    }: UpdateBlogPostCommand): Promise<void> {
        await this.postgresBlogsRepository.findByIdNonDeletedOrNotFoundFail(
            blogId,
        );
        await this.postgresPostsRepository.updatePostById(postId, dto);

        // post.update(dto);
        // await this.mongoPostsRepository.save(post);
    }
}
