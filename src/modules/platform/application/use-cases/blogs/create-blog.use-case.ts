import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Blog, BlogModelType } from '../../../domain/blog.entity';
import { CreateBlogDto } from '../../../dto/create';
import { BlogsRepository } from '../../../infrastructure';

export class CreateBlogCommand {
    constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
    implements ICommandHandler<CreateBlogCommand, string>
{
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
        private blogsRepository: BlogsRepository,
    ) {}

    async execute({ dto }: CreateBlogCommand): Promise<string> {
        const newBlog = this.BlogModel.createInstance(dto);

        await this.blogsRepository.save(newBlog);

        return newBlog._id.toString();
    }
}
