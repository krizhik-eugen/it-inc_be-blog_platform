import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { add } from 'date-fns';
import { CreateUserDomainDto } from './dto/create/create-user.domain.dto';
import { userEmailValidation, userLoginValidation } from './validation-rules';
import { CONFIRMATION_CODE_EXPIRATION_TIME } from '../../../constants';
import {
    BadRequestDomainException,
    NotFoundDomainException,
} from '../../../core/exceptions/domain-exceptions';

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
     * Factory method to create a confirmed User instance
     * @param {CreateUserDto} dto - The data transfer object for user creation
     * @returns {UserDocument} The created user document
     */
    static createConfirmedInstance(dto: CreateUserDomainDto): UserDocument {
        const user = new this();

        user.email = dto.email;
        user.passwordHash = dto.passwordHash;
        user.login = dto.login;
        user.emailConfirmation.isConfirmed = true;

        return user as UserDocument;
    }

    /**
     * Sets the confirmation code for the user's email address.
     *
     * @param {string} code - The confirmation code to be set.
     *
     * @throws {BadRequestDomainException} If the user's email has already been confirmed.
     * @throws {Error} If the confirmation code is not provided.
     */
    setConfirmationCode(code: string) {
        if (this.emailConfirmation.isConfirmed) {
            throw new BadRequestDomainException(
                'The user has already been confirmed',
                'email',
            );
        }

        if (!code) {
            throw new Error('Code is not provided');
        }

        this.emailConfirmation.confirmationCode = code;
        this.emailConfirmation.expirationDate = add(new Date(), {
            hours: CONFIRMATION_CODE_EXPIRATION_TIME,
        });
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
            throw new BadRequestDomainException(
                'The user has already been confirmed',
                'code',
            );
        }

        if (this.emailConfirmation.confirmationCode !== code) {
            throw new BadRequestDomainException('Invalid code', 'code');
        }

        if (!this.emailConfirmation.expirationDate) {
            throw new Error(
                'Expiration date for email confirmation is not set',
            );
        }

        if (new Date() > this.emailConfirmation.expirationDate) {
            throw new BadRequestDomainException('Code expired', 'code');
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
    setPasswordRecoveryCode(code: string) {
        if (!code) {
            throw new Error('Code is not provided');
        }

        this.passwordRecovery.recoveryCode = code;
        this.passwordRecovery.expirationDate = add(new Date(), {
            hours: CONFIRMATION_CODE_EXPIRATION_TIME,
        });
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
            throw new BadRequestDomainException('Invalid code', 'code');
        }

        if (!this.passwordRecovery.expirationDate) {
            throw new Error(
                'Expiration date for email confirmation is not set',
            );
        }

        if (Date.now() > this.passwordRecovery.expirationDate.getTime()) {
            throw new BadRequestDomainException(
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
            throw new NotFoundDomainException('Entity is already deleted');
        }
        this.deletedAt = new Date().toISOString();
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
