import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

export class PostsRepository {
    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

    async save(post: PostDocument) {
        return await post.save();
    }

    async findById(id: string): Promise<PostDocument | null> {
        return this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByIdOrNotFoundFail(id: string): Promise<PostDocument> {
        const post = await this.findById(id);

        if (!post) {
            throw new NotFoundDomainException('post not found');
        }

        return post;
    }

    async findByIdNonDeletedOrNotFoundFail(id: string): Promise<PostDocument> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!post) {
            throw new NotFoundDomainException('post not found');
        }
        return post;
    }
}
