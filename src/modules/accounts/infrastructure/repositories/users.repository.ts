import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { User, UserDocument, UserModelType } from '../../domain/user.entity';

export class UsersRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

    async save(user: UserDocument) {
        return user.save();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.UserModel.findById(id);
    }

    async findByIds(ids: string[]): Promise<UserDocument[]> {
        return this.UserModel.find({ _id: { $in: ids } });
    }

    async findByIdNonDeleted(id: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByIdOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);

        if (!user) {
            throw NotFoundDomainException.create('User is not found');
        }

        return user;
    }

    async findByIdNonDeletedOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!user) {
            throw NotFoundDomainException.create('User is not found');
        }
        return user;
    }

    async findByLoginOrEmail(
        loginOrEmail: string,
    ): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne().or([
            { login: loginOrEmail },
            { email: loginOrEmail },
        ]);
        return user;
    }

    async findByLoginOrEmailNonDeleted(
        loginOrEmail: string,
    ): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne()
            .and([{ deletedAt: null }])
            .or([{ login: loginOrEmail }, { email: loginOrEmail }]);
        return user;
    }

    async findByLoginOrEmailNonDeletedOrNotFoundFail(
        loginOrEmail: string,
    ): Promise<UserDocument> {
        const user = await this.UserModel.findOne()
            .and([{ deletedAt: null }])
            .or([{ login: loginOrEmail }, { email: loginOrEmail }]);
        if (!user) {
            throw NotFoundDomainException.create('User is not found');
        }
        return user;
    }

    async findUserByConfirmationCode(
        code: string,
    ): Promise<UserDocument | null> {
        const user = await this.UserModel.findOne({
            'emailConfirmation.confirmationCode': code,
        });
        return user;
    }

    async findUserByRecoveryCodeOrNotFoundFail(
        code: string,
    ): Promise<UserDocument> {
        const user = await this.UserModel.findOne({
            'passwordRecovery.recoveryCode': code,
        });
        if (!user) {
            throw NotFoundDomainException.create(
                'No user found for this recovery code',
            );
        }
        return user;
    }
}
