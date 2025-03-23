import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure';
import { UpdateBlogDto } from '../../../dto/update';

export class UpdateBlogCommand {
    constructor(
        public id: number,
        public dto: UpdateBlogDto,
    ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
    implements ICommandHandler<UpdateBlogCommand, void>
{
    constructor(private blogsRepository: BlogsRepository) {}

    async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
        await this.blogsRepository.updateBlog(id, dto);
    }
}
