import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { postValidationRules } from './validation-rules';
import { CreatePostDomainDto } from './dto/create/create-post.domain.dto';
import { UpdatePostDomainDto } from './dto/update/update-post.domain.dto';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

/**
 * Post Entity Schema
 * This class represents the schema and behavior of a Post entity.
 */
@Schema({ timestamps: true })
export class Post {
    /**
     * Id of the blog that the post belongs to
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    blogId: string;

    /**
     * Name of the blog that the post belongs to
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    blogName: string;

    /**
     * Title of the post
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
        maxlength: postValidationRules.title.maxLength,
    })
    title: string;

    /**
     * Content of the post
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
        maxlength: postValidationRules.content.maxLength,
    })
    content: string;

    /**
     * Short description of the post
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
        maxlength: postValidationRules.shortDescription.maxLength,
    })
    shortDescription: string;

    /**
     * Likes count of the post
     * @type {number}
     * @required
     */
    @Prop({
        type: Number,
        required: true,
        default: 0,
    })
    likesCount: number;

    /**
     * Dislikes count of the post
     * @type {number}
     * @required
     */
    @Prop({
        type: Number,
        required: true,
        default: 0,
    })
    dislikesCount: number;

    /**
     * Creation timestamp
     * Explicitly defined despite timestamps: true
     * properties without @Prop for typescript so that they are in the class instance (or in instance methods)
     * @type {String}
     */
    createdAt: string;
    updatedAt: string;

    /**
     * Deletion timestamp, nullable, if date exist, means entity soft deleted
     * @type {String | null}
     */
    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    /**
     * Factory method to create a Post instance
     * @param {CreateBlogPostDto} dto - The data transfer object for post creation
     * @returns {PostDocument} The created post document
     */
    static createInstance(dto: CreatePostDomainDto): PostDocument {
        const post = new this();

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = dto.blogId;
        post.blogName = dto.blogName;

        return post as PostDocument;
    }

    /**
     * Factory method to update a Post instance
     * @param {UpdatePostDto} dto - The data transfer object for post creation
     */
    update(dto: UpdatePostDomainDto) {
        if (dto.title) {
            this.title = dto.title;
        }
        if (dto.shortDescription) {
            this.shortDescription = dto.shortDescription;
        }
        if (dto.content) {
            this.content = dto.content;
        }
    }

    /**
     * Marks the post as deleted
     * Throws an error if already deleted
     * @throws {Error} If the entity is already deleted
     */
    makeDeleted() {
        if (this.deletedAt) {
            throw new NotFoundDomainException('Entity already deleted');
        }
        this.deletedAt = new Date().toISOString();
    }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
