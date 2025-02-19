import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure';
import { UpdatePostDto } from '../../../dto/update';

export class UpdatePostCommand {
    constructor(
        public id: string,
        public dto: UpdatePostDto,
    ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase
    implements ICommandHandler<UpdatePostCommand, void>
{
    constructor(private postsRepository: PostsRepository) {}

    async execute({ id, dto }: UpdatePostCommand): Promise<void> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(id);

        post.update(dto);
        await this.postsRepository.save(post);
    }
}
