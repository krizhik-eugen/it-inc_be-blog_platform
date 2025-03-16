import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    PostgresBlogsRepository,
    PostgresPostsRepository,
} from '../../../infrastructure';

export class DeleteBlogPostCommand {
    constructor(
        public postId: number,
        public blogId: number,
    ) {}
}

@CommandHandler(DeleteBlogPostCommand)
export class DeleteBlogPostUseCase
    implements ICommandHandler<DeleteBlogPostCommand, void>
{
    constructor(
        // private mongoPostsRepository: MongoPostsRepository,
        private postgresPostsRepository: PostgresPostsRepository,
        private postgresBlogsRepository: PostgresBlogsRepository,
        // private commentsRepository: CommentsRepository,
        // private likesRepository: LikesRepository,
    ) {}

    async execute({ postId, blogId }: DeleteBlogPostCommand): Promise<void> {
        await this.postgresBlogsRepository.findByIdNonDeletedOrNotFoundFail(
            blogId,
        );

        await this.postgresPostsRepository.makePostDeletedById(postId);

        // post.makeDeleted();

        // await this.mongoPostsRepository.save(post);

        // TODO: delete comments and likes
        // const comments =
        //     await this.commentsRepository.findAllByPostIdNonDeleted(postId);
        // const commentIds = comments.map((c) => c._id.toString());
        // await this.commentsRepository.deleteAllByPostId(postId);
        // await this.likesRepository.deleteAllByParentIds(commentIds);
    }
}
