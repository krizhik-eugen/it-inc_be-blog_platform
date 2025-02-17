import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateCommentDomainDto } from './dto/create/create-comment.domain.dto';
import { UpdateCommentDomainDto } from './dto/update/update-comment.domain.dto';
import {
    ForbiddenDomainException,
    NotFoundDomainException,
} from '../../../core/exceptions/domain-exceptions';
import { ParentLikesEntity } from './parent-likes.entity';

export const commentConstraints = {
    content: {
        minLength: 20,
        maxLength: 300,
        errorMessageMinLength:
            'Comment content must be between 20 and 300 characters',
    },
};

/**
 * Comment Entity Schema
 * This class represents the schema and behavior of a Comment entity.
 */
@Schema({ timestamps: true })
export class Comment extends ParentLikesEntity {
    /**
     * Id of the post that the comment belongs to
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    postId: string;

    /**
     * Content of the comment
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
        minlength: commentConstraints.content.minLength,
        maxlength: commentConstraints.content.maxLength,
        default: '',
    })
    content: string;

    /**
     * Information about the user who created the comment
     * @type {Object}
     * @property {string} userId - The unique identifier of the commenting user
     * @property {string} userLogin - The login of the commenting user
     * @required
     */
    @Prop({
        type: {
            userId: { type: String, required: true },
            userLogin: { type: String, required: true },
        },
        required: true,
        _id: false,
        default: {
            userId: '',
            userLogin: '',
        },
    })
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };

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
     * Factory method to create a Comment instance
     * @param {CreateBlogCommentDto} dto - The data transfer object for comment creation
     * @returns {CommentDocument} The created comment document
     */
    static createInstance(dto: CreateCommentDomainDto): CommentDocument {
        const comment = new this();

        comment.content = dto.content;
        comment.commentatorInfo.userId = dto.commentatorInfo.userId;
        comment.commentatorInfo.userLogin = dto.commentatorInfo.userLogin;
        comment.postId = dto.postId;

        return comment as CommentDocument;
    }

    /**
     * Factory method to update a Comment instance
     * @param {UpdateCommentDto} dto - The data transfer object for comment creation
     */
    update(dto: UpdateCommentDomainDto) {
        if (dto.userId !== this.commentatorInfo.userId) {
            throw ForbiddenDomainException.create(
                'You are not an owner of this comment',
            );
        }
        this.content = dto.content;
    }

    /**
     * Marks the comment as deleted
     * Throws an error if already deleted
     * @throws {Error} If the entity is already deleted
     */
    makeDeleted() {
        if (this.deletedAt) {
            throw NotFoundDomainException.create('Entity already deleted');
        }
        this.deletedAt = new Date().toISOString();
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
