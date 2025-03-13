import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostgresBlogsRepository } from '../../../infrastructure';
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
    constructor(
        // private mongoBlogsRepository: MongoBlogsRepository,
        private postgresBlogsRepository: PostgresBlogsRepository,
    ) {}

    async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
        await this.postgresBlogsRepository.updateBlog(id, dto);
    }
}
