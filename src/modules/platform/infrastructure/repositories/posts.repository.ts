import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

export class PostsRepository {
    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

    async save(post: PostDocument) {
        return post.save();
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
            throw NotFoundDomainException.create('Post not found');
        }

        return post;
    }

    async findByIdNonDeletedOrNotFoundFail(id: string): Promise<PostDocument> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!post) {
            throw NotFoundDomainException.create('Post not found');
        }
        return post;
    }

    async findAllByBlogIdNonDeleted(blogId: string): Promise<PostDocument[]> {
        return this.PostModel.find({
            blogId: blogId,
            deletedAt: null,
        });
    }

    async deleteAllByBlogId(blogId: string): Promise<void> {
        await this.PostModel.updateMany(
            { blogId: blogId, deletedAt: null },
            { deletedAt: new Date().toISOString() },
        );
    }
}
