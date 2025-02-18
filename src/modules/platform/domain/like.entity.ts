import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { NotFoundDomainException } from '../../../core/exceptions';
import { CreateLikeDomainDto } from './dto/create/create-like.domain.dto';
import { UpdateLikeDomainDto } from './dto/update/update-like.domain.dto';

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}

/**
 * Like Entity Schema
 * This class represents the schema and behavior of a Like entity.
 */
@Schema({ timestamps: true })
export class Like {
    /**
     * Id of the entity (for example, post or comment) that the like belongs to
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    parentId: string;

    /**
     * Id of the user who created the like
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    userId: string;

    /**
     * Status of the like
     * @type {LikeStatus}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    status: LikeStatus;

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
     * Factory method to create a Like instance
     * @param {CreateLikeDto} dto - The data transfer object for like creation
     * @returns {LikeDocument} The created like document
     */
    static createInstance(dto: CreateLikeDomainDto): LikeDocument {
        const like = new this();

        like.parentId = dto.parentId;
        like.userId = dto.userId;
        like.status = dto.status;

        return like as LikeDocument;
    }

    /**
     * Factory method to update a Like instance
     * @param {UpdateLikeDto} dto - The data transfer object for like creation
     */
    update(dto: UpdateLikeDomainDto) {
        this.status = dto.status;
    }

    /**
     * Marks the like as deleted
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

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.loadClass(Like);

export type LikeDocument = HydratedDocument<Like>;

export type LikeModelType = Model<LikeDocument> & typeof Like;
