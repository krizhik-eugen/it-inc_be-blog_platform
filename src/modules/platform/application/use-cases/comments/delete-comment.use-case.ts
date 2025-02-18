import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions';

export class DeleteCommentCommand {
    constructor(
        public commentId: string,
        public userId: string,
    ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
    implements ICommandHandler<DeleteCommentCommand, void>
{
    constructor(private commentsRepository: CommentsRepository) {}

    async execute({ commentId, userId }: DeleteCommentCommand): Promise<void> {
        const comment =
            await this.commentsRepository.findByIdNonDeletedOrNotFoundFail(
                commentId,
            );

        if (comment.commentatorInfo.userId !== userId) {
            throw ForbiddenDomainException.create(
                'You are not an owner of this comment',
            );
        }

        comment.makeDeleted();

        await this.commentsRepository.save(comment);

        //TODO: Handle likes removing
    }
}
