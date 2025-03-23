import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository, PostsRepository } from '../../../infrastructure';
import { CreateCommentDto } from '../../../dto/create';
import { UsersRepository } from '../../../../accounts/infrastructure';

export class CreateCommentCommand {
    constructor(
        public postId: number,
        public userId: number,
        public dto: CreateCommentDto,
    ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
    implements ICommandHandler<CreateCommentCommand, number>
{
    constructor(
        private commentsRepository: CommentsRepository,
        private postsRepository: PostsRepository,
        private usersRepository: UsersRepository,
    ) {}

    async execute({
        postId,
        userId,
        dto,
    }: CreateCommentCommand): Promise<number> {
        await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);
        await this.usersRepository.findByIdOrNotFoundFail(userId);

        const newCommentId = await this.commentsRepository.addNewComment({
            postId,
            userId,
            content: dto.content,
        });

        return newCommentId;
    }
}
