import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { NotFoundDomainException } from '../../../core/exceptions';
import { CreateSessionDomainDto } from './dto/create';
import { UpdateSessionDomainDto } from './dto/update';

/**
 * Session Entity Schema
 * This class represents the schema and behavior of a Session entity.
 */
@Schema({ timestamps: true })
export class Session {
    /**
     * Id of the MongoUser
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    userId: string;

    /**
     * Id of the device
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    deviceId: string;

    /**
     * Name of the device
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
        default: 'Unknown device',
    })
    deviceName: string;

    /**
     * IP of the device
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
    })
    ip: string;

    /**
     * Timestamp of the issued session
     * @type {number}
     * @required
     */
    @Prop({
        type: Number,
        required: true,
    })
    iat: number;

    /**
     * Timestamp of the expiration of the session
     * @type {number}
     * @required
     */
    @Prop({
        type: Number,
        required: true,
    })
    exp: number;

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
     * Factory method to create a Session instance
     * @param {CreateSessionDto} dto - The data transfer object for user creation
     * @returns {SessionDocument} The created user document
     */
    static createInstance(dto: CreateSessionDomainDto): SessionDocument {
        const session = new this();

        session.userId = dto.userId;
        session.deviceId = dto.deviceId;
        session.deviceName = dto.deviceName;
        session.ip = dto.ip;
        session.iat = dto.iat;
        session.exp = dto.exp;

        return session as SessionDocument;
    }

    /**
     * Updates the session instance with new data
     * @param {UpdateSessionDto} dto - The data transfer object for user updates
     */
    update(dto: UpdateSessionDomainDto) {
        this.ip = dto.ip;
        this.iat = dto.iat;
        this.exp = dto.exp;
    }

    /**
     * Marks the session as deleted
     * Throws an error if already deleted
     * @throws {Error} If the entity is already deleted
     */
    makeDeleted() {
        if (this.deletedAt) {
            throw NotFoundDomainException.create('Entity is already deleted');
        }
        this.deletedAt = new Date().toISOString();
    }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.loadClass(Session);

export type SessionDocument = HydratedDocument<Session>;

export type SessionModelType = Model<SessionDocument> & typeof Session;
