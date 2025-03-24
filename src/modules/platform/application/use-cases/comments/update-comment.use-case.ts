import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure';
import { UpdateCommentDto } from '../../../dto/update';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class UpdateCommentCommand {
    constructor(
        public id: number,
        public dto: UpdateCommentDto,
        public userId: number,
    ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
    implements ICommandHandler<UpdateCommentCommand, void>
{
    constructor(private commentsRepository: CommentsRepository) {}

    async execute({ id, dto, userId }: UpdateCommentCommand): Promise<void> {
        const comment =
            await this.commentsRepository.findByIdNonDeletedOrNotFoundFail(id);

        if (comment.user_id !== userId) {
            throw ForbiddenDomainException.create(
                'You are not an owner of this comment',
            );
        }

        await this.commentsRepository.updateCommentById(id, dto);
    }
}
