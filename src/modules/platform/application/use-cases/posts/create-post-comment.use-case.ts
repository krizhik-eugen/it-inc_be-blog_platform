import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository, PostsRepository } from '../../../infrastructure';
import { CreateCommentDto } from '../../../dto/create';
import { UsersService } from '../../../../accounts/application/users.service';

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
        private usersService: UsersService,
    ) {}

    async execute({
        postId,
        userId,
        dto,
    }: CreateCommentCommand): Promise<number> {
        await this.postsRepository.findByIdNonDeletedOrNotFoundFail(postId);
        await this.usersService.findByIdOrNotFoundFail(userId);

        const newCommentId = await this.commentsRepository.addNewComment({
            postId,
            userId,
            content: dto.content,
        });

        return newCommentId;
    }
}
