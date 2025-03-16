// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { InjectModel } from '@nestjs/mongoose';
// import { LikesRepository, MongoPostsRepository } from '../../../infrastructure';
// import { Like, LikeModelType } from '../../../domain/like.entity';
// import { MongoPostDocument } from '../../../domain/post.entity';
// import {
//     UpdateLikeStatusBaseCommand,
//     UpdateLikeStatusBaseUseCase,
// } from '../base';

// export class UpdatePostLikeStatusCommand extends UpdateLikeStatusBaseCommand {}

// @CommandHandler(UpdatePostLikeStatusCommand)
// export class UpdatePostLikeStatusUseCase
//     extends UpdateLikeStatusBaseUseCase<MongoPostDocument>
//     implements ICommandHandler<UpdatePostLikeStatusCommand, void>
// {
//     constructor(
//         @InjectModel(Like.name)
//         LikeModel: LikeModelType,
//         likesRepository: LikesRepository,
//         private mongoPostsRepository: MongoPostsRepository,
//     ) {
//         super(LikeModel, likesRepository);
//     }

//     async getParentById(postId: string): Promise<MongoPostDocument> {
//         return this.mongoPostsRepository.findByIdOrNotFoundFail(postId);
//     }
//     async saveParent(post: MongoPostDocument): Promise<MongoPostDocument> {
//         return this.mongoPostsRepository.save(post);
//     }
// }
