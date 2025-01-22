import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateUserDto } from '../dto/create-user.dto';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { Name, NameSchema } from './name.schema';
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
     * Email confirmation status (if not confirmed in 2 days account will be deleted)
     * @type {boolean}
     * @default false
     */
    @Prop({ type: Boolean, required: true, default: false })
    isEmailConfirmed: boolean;

    // @Prop(NameSchema) this variant from doc doesn't make validation for inner object
    @Prop({ type: NameSchema })
    name: Name;

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

    // /**
    //  * Virtual property to get the stringified ObjectId
    //  * @returns {string} The string representation of the ID
    //  * если ипсльзуете по всей системе шв айди как string, можете юзать, если id
    //  */
    // get id() {
    //     // @ts-ignore
    //     return this._id.toString();
    // }

    /**
     * Factory method to create a User instance
     * @param {CreateUserDto} dto - The data transfer object for user creation
     * @returns {UserDocument} The created user document
     * DDD started: как создать сущность, чтобы она не нарушала бизнес-правила? Делегируем это создание статическому методу
     */
    static createInstance(dto: CreateUserDomainDto): UserDocument {
        const user = new this();
        user.email = dto.email;
        user.passwordHash = dto.passwordHash;
        user.login = dto.login;
        // user.isEmailConfirmed = false;

        user.name = {
            firstName: 'firstName xxx',
            lastName: 'lastName yyy',
        };

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

    /**
     * Updates the user instance with new data
     * Resets email confirmation if email is updated
     * @param {UpdateUserDto} dto - The data transfer object for user updates
     */
    update(dto: UpdateUserDto) {
        if (dto.email !== this.email) {
            this.isEmailConfirmed = false;
        }
        this.email = dto.email;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
