import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure';
import { UpdateBlogDto } from '../../../dto/update';

export class UpdateBlogCommand {
    constructor(
        public id: string,
        public dto: UpdateBlogDto,
    ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
    implements ICommandHandler<UpdateBlogCommand, void>
{
    constructor(private blogsRepository: BlogsRepository) {}

    async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
        const blog =
            await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(id);

        blog.update(dto);
        await this.blogsRepository.save(blog);
    }
}
