import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { userEmailValidation, userLoginValidation } from './validation-rules';

/**
 * User Entity Schema
 * This class represents the schema and behavior of a User entity.
 */
@Schema({ timestamps: true })
export class User {
    /**
     * Login of the user (must be uniq)
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
        unique: true,
        minlength: userLoginValidation.minLength,
        maxlength: userLoginValidation.maxLength,
        validate: {
            validator: (value: string) =>
                userLoginValidation.pattern.test(value),
            message: userLoginValidation.errorMessagePattern,
        },
    })
    login: string;

    /**
     * Password hash for authentication
     * @type {string}
     * @required
     */
    @Prop({ type: String, required: true })
    passwordHash: string;

    /**
     * Email of the user
     * @type {string}
     * @required
     */
    @Prop({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) =>
                userEmailValidation.pattern.test(value),
            message: userEmailValidation.errorMessagePattern,
        },
    })
    email: string;

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
     * Factory method to create a User instance
     * @param {CreateUserDto} dto - The data transfer object for user creation
     * @returns {UserDocument} The created user document
     */
    static createInstance(dto: CreateUserDomainDto): UserDocument {
        const user = new this();

        user.email = dto.email;
        user.passwordHash = dto.passwordHash;
        user.login = dto.login;

        return user as UserDocument;
    }

    /**
     * Marks the user as deleted
     * Throws an error if already deleted
     * @throws {Error} If the entity is already deleted
     */
    makeDeleted() {
        if (this.deletedAt) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date().toISOString();
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
