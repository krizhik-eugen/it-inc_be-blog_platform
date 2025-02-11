import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto } from './dto/create/create-user.domain.dto';
import {
    BadRequestDomainException,
    NotFoundDomainException,
} from '../../../core/exceptions/domain-exceptions';
import { UpdateUserDomainDto } from './dto/update/update-user.domain.dto';

export const userLoginConstraints = {
    minLength: 3,
    maxLength: 10,
    errorMessage: 'Login must be between 3 and 10 symbols',
    pattern: /^[a-zA-Z0-9_-]*$/,
    errorMessagePattern:
        'Login should contain only latin letters, numbers, - and _',
};

export const userPasswordConstraints = {
    minLength: 6,
    maxLength: 20,
    errorMessage: 'Password must be between 6 and 20 symbols',
};

export const userEmailConstraints = {
    pattern: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
    errorMessagePattern:
        'Email should be a valid email address, example: example@example.com',
};

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
        minlength: userLoginConstraints.minLength,
        maxlength: userLoginConstraints.maxLength,
        validate: {
            validator: (value: string) =>
                userLoginConstraints.pattern.test(value),
            message: userLoginConstraints.errorMessagePattern,
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
                userEmailConstraints.pattern.test(value),
            message: userEmailConstraints.errorMessagePattern,
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
     * Email confirmation details
     *
     * This object contains information about the user's email confirmation status.
     *
     * @type {{
     *   isConfirmed: boolean;
     *   confirmationCode: string | null;
     *   expirationDate: string | null;
     * }}
     */
    @Prop({
        type: {
            isConfirmed: Boolean,
            confirmationCode: String,
            expirationDate: String,
        },
        default: {
            isConfirmed: false,
            confirmationCode: null,
            expirationDate: null,
        },
        _id: false,
    })
    emailConfirmation: {
        /**
         * Whether the user's email has been confirmed
         */
        isConfirmed: boolean;
        /**
         * The confirmation code sent to the user's email
         */
        confirmationCode: string | null;
        /**
         * The expiration date of the confirmation code
         */
        expirationDate: Date | null;
    };

    /**
     * Password recovery details
     *
     * This object contains information about the user's password recovery status.
     *
     * @type {{
     *   recoveryCode: string | null;
     *   expirationDate: Date | null;
     * }}
     */
    @Prop({
        type: {
            recoveryCode: String,
            expirationDate: Date,
        },
        default: {
            recoveryCode: null,
            expirationDate: null,
        },
        _id: false,
    })
    passwordRecovery: {
        /**
         * The recovery code sent to the user's email
         */
        recoveryCode: string | null;
        /**
         * The expiration date of the recovery code
         */
        expirationDate: Date | null;
    };

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
     * Updates the user instance with new data
     * Resets email confirmation if email is updated
     * @param {UpdateUserDto} dto - The data transfer object for user updates
     */
    update(dto: UpdateUserDomainDto) {
        if (dto.email !== this.email) {
            this.emailConfirmation.isConfirmed = false;
        }
        this.email = dto.email;
    }

    /**
     * Sets the confirmation code for the user's email address.
     *
     * @param {string} code - The confirmation code to be set.
     *
     * @throws {BadRequestDomainException} If the user's email has already been confirmed.
     * @throws {Error} If the confirmation code is not provided.
     */
    setConfirmationCode(code: string, expirationDate: Date) {
        if (this.emailConfirmation.isConfirmed) {
            throw BadRequestDomainException.create(
                'The user has already been confirmed',
                'email',
            );
        }

        if (!code) {
            throw new Error('Code is not provided');
        }

        this.emailConfirmation.confirmationCode = code;
        this.emailConfirmation.expirationDate = expirationDate;
    }

    /**
     * Confirms the user's email address using the provided confirmation code.
     *
     * @param {string} code - The confirmation code to be used for email confirmation.
     *
     * @throws {BadRequestDomainException} If the user's email has already been confirmed.
     * @throws {BadRequestDomainException} If the confirmation code is invalid.
     * @throws {Error} If the expiration date for email confirmation is not set.
     * @throws {BadRequestDomainException} If the confirmation code has expired.
     */
    confirmUserEmail(code: string) {
        if (this.emailConfirmation.isConfirmed) {
            throw BadRequestDomainException.create(
                'The user has already been confirmed',
                'code',
            );
        }

        if (this.emailConfirmation.confirmationCode !== code) {
            throw BadRequestDomainException.create('Invalid code', 'code');
        }

        if (!this.emailConfirmation.expirationDate) {
            throw new Error(
                'Expiration date for email confirmation is not set',
            );
        }

        if (new Date() > this.emailConfirmation.expirationDate) {
            throw BadRequestDomainException.create('Code expired', 'code');
        }

        this.emailConfirmation.isConfirmed = true;
    }

    /**
     * Sets the password recovery code for the user.
     *
     * @param {string} code - The password recovery code to be set.
     *
     * @throws {Error} If the password recovery code is not provided.
     */
    setPasswordRecoveryCode(code: string, expirationDate: Date) {
        if (!code) {
            throw new Error('Code is not provided');
        }

        this.passwordRecovery.recoveryCode = code;
        this.passwordRecovery.expirationDate = expirationDate;
    }

    /**
     * Changes the user's password using the provided password recovery code and new password hash.
     *
     * @param {string} code - The password recovery code to be used for password change.
     * @param {string} passwordHash - The new password hash to be set.
     *
     * @throws {BadRequestDomainException} If the password recovery code is invalid.
     * @throws {Error} If the expiration date for password recovery is not set.
     * @throws {BadRequestDomainException} If the password recovery code has expired.
     */
    changePassword(code: string, passwordHash: string) {
        if (this.passwordRecovery.recoveryCode !== code) {
            throw BadRequestDomainException.create('Invalid code', 'code');
        }

        if (!this.passwordRecovery.expirationDate) {
            throw new Error(
                'Expiration date for email confirmation is not set',
            );
        }

        if (Date.now() > this.passwordRecovery.expirationDate.getTime()) {
            throw BadRequestDomainException.create(
                'Confirmation code expired',
                'recoveryCode',
            );
        }

        this.passwordHash = passwordHash;
        this.passwordRecovery.recoveryCode = null;
        this.passwordRecovery.expirationDate = null;
    }

    /**
     * Marks the user as deleted
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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
