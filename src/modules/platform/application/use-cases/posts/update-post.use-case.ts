// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { MongoPostsRepository } from '../../../infrastructure';
// import { UpdatePostDto } from '../../../dto/update';

// export class UpdatePostCommand {
//     constructor(
//         public id: string,
//         public dto: UpdatePostDto,
//     ) {}
// }

// @CommandHandler(UpdatePostCommand)
// export class UpdatePostUseCase
//     implements ICommandHandler<UpdatePostCommand, void>
// {
//     constructor(private mongoPostsRepository: MongoPostsRepository) {}

//     async execute({ id, dto }: UpdatePostCommand): Promise<void> {
//         const post =
//             await this.mongoPostsRepository.findByIdNonDeletedOrNotFoundFail(
//                 id,
//             );

//         post.update(dto);
//         await this.mongoPostsRepository.save(post);
//     }
// }
