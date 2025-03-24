import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure';
import { ForbiddenDomainException } from '../../../../../core/exceptions';

export class DeleteCommentCommand {
    constructor(
        public commentId: number,
        public userId: number,
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

        if (comment.user_id !== userId) {
            throw ForbiddenDomainException.create(
                'You are not an owner of this comment',
            );
        }

        await this.commentsRepository.makeDeleted(commentId);

        //TODO: Handle likes removing
    }
}
