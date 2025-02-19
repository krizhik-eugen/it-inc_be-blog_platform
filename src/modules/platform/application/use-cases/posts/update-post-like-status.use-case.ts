import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { LikesRepository, PostsRepository } from '../../../infrastructure';
import { Like, LikeModelType } from '../../../domain/like.entity';
import { PostDocument } from '../../../domain/post.entity';
import {
    UpdateLikeStatusBaseCommand,
    UpdateLikeStatusBaseUseCase,
} from '../base';

export class UpdatePostLikeStatusCommand extends UpdateLikeStatusBaseCommand {}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase
    extends UpdateLikeStatusBaseUseCase<PostDocument>
    implements ICommandHandler<UpdatePostLikeStatusCommand, void>
{
    constructor(
        @InjectModel(Like.name)
        LikeModel: LikeModelType,
        likesRepository: LikesRepository,
        private postsRepository: PostsRepository,
    ) {
        super(LikeModel, likesRepository);
    }

    async getParentById(postId: string): Promise<PostDocument> {
        return this.postsRepository.findByIdOrNotFoundFail(postId);
    }
    async saveParent(post: PostDocument): Promise<PostDocument> {
        return this.postsRepository.save(post);
    }
}
