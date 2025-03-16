import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from '../../../dto/create';
import { PostgresBlogsRepository } from '../../../infrastructure';

export class CreateBlogCommand {
    constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
    implements ICommandHandler<CreateBlogCommand, number>
{
    constructor(
        // @InjectModel(MongoBlog.name)
        // private BlogModel: MongoBlogModelType,
        // private mongoBlogsRepository: MongoBlogsRepository,
        private postgresBlogsRepository: PostgresBlogsRepository,
    ) {}

    async execute({ dto }: CreateBlogCommand): Promise<number> {
        // const newBlog = this.BlogModel.createInstance(dto);
        const newBlogId = await this.postgresBlogsRepository.addNewBlog(dto);

        return newBlogId;
    }
}
