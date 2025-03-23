import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from '../../../dto/create';
import { BlogsRepository } from '../../../infrastructure';

export class CreateBlogCommand {
    constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
    implements ICommandHandler<CreateBlogCommand, number>
{
    constructor(private blogsRepository: BlogsRepository) {}

    async execute({ dto }: CreateBlogCommand): Promise<number> {
        const newBlogId = await this.blogsRepository.addNewBlog(dto);

        return newBlogId;
    }
}
