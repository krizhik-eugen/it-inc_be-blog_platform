import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../infrastructure';
import { UpdateCommentDto } from '../../../dto/update';

export class UpdateCommentCommand {
    constructor(
        public id: string,
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

        comment.update({ userId, ...dto });

        await this.commentsRepository.save(comment);
    }
}
