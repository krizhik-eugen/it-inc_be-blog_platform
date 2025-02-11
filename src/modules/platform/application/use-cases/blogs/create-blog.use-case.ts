import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../domain/blog.entity';
import { CreateBlogDto } from '../../../dto/create/create-blog.dto';
import { BlogsRepository } from '../../../infrastructure/repositories/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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
        const blog = this.BlogModel.createInstance(dto);

        await this.blogsRepository.save(blog);

        return blog._id.toString();
    }
}
