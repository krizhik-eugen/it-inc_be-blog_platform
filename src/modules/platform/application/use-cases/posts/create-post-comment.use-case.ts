import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository, PostsRepository } from '../../../infrastructure';
import { CreateCommentDto } from '../../../dto/create';
import { UsersMongoRepository } from '../../../../accounts/infrastructure';
import { CommentModelType, Comment } from '../../../domain/comment.entity';

export class CreateCommentCommand {
    constructor(
        public postId: string,
        public userId: string,
        public dto: CreateCommentDto,
    ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
    implements ICommandHandler<CreateCommentCommand, string>
{
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
        private commentsRepository: CommentsRepository,
        private postsRepository: PostsRepository,
        private usersMongoRepository: UsersMongoRepository,
    ) {}

    async execute({
        postId,
        userId,
        dto,
    }: CreateCommentCommand): Promise<string> {
        const foundPost =
            await this.postsRepository.findByIdOrNotFoundFail(postId);

        const foundUser =
            await this.usersMongoRepository.findByIdOrNotFoundFail(userId);

        const newComment = this.CommentModel.createInstance({
            content: dto.content,
            commentatorInfo: {
                userId: foundUser._id.toString(),
                userLogin: foundUser.login,
            },
            postId: foundPost._id.toString(),
        });

        await this.commentsRepository.save(newComment);

        return newComment._id.toString();
    }
}
