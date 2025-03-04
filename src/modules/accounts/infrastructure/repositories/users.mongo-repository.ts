import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions';
import { MongoUser, MongoUserDocument, MongoUserModelType } from '../../domain/user.entity';

export class UsersMongoRepository {
    constructor(@InjectModel(MongoUser.name) private MongoUserModel: MongoUserModelType) {}

    async save(user: MongoUserDocument) {
        return user.save();
    }

    async findById(id: string): Promise<MongoUserDocument | null> {
        return this.MongoUserModel.findById(id);
    }

    async findByIds(ids: string[]): Promise<MongoUserDocument[]> {
        return this.MongoUserModel.find({ _id: { $in: ids } });
    }

    async findByIdNonDeleted(id: string): Promise<MongoUserDocument | null> {
        return this.MongoUserModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByIdOrNotFoundFail(id: string): Promise<MongoUserDocument> {
        const user = await this.findById(id);

        if (!user) {
            throw NotFoundDomainException.create('MongoUser is not found');
        }

        return user;
    }

    async findByIdNonDeletedOrNotFoundFail(id: string): Promise<MongoUserDocument> {
        const user = await this.MongoUserModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!user) {
            throw NotFoundDomainException.create('MongoUser is not found');
        }
        return user;
    }

    async findByLoginOrEmail(
        loginOrEmail: string,
    ): Promise<MongoUserDocument | null> {
        const user = await this.MongoUserModel.findOne().or([
            { login: loginOrEmail },
            { email: loginOrEmail },
        ]);
        return user;
    }

    async findByLoginOrEmailNonDeleted(
        loginOrEmail: string,
    ): Promise<MongoUserDocument | null> {
        const user = await this.MongoUserModel.findOne()
            .and([{ deletedAt: null }])
            .or([{ login: loginOrEmail }, { email: loginOrEmail }]);
        return user;
    }

    async findByLoginOrEmailNonDeletedOrNotFoundFail(
        loginOrEmail: string,
    ): Promise<MongoUserDocument> {
        const user = await this.MongoUserModel.findOne()
            .and([{ deletedAt: null }])
            .or([{ login: loginOrEmail }, { email: loginOrEmail }]);
        if (!user) {
            throw NotFoundDomainException.create('MongoUser is not found');
        }
        return user;
    }

    async findUserByConfirmationCode(
        code: string,
    ): Promise<MongoUserDocument | null> {
        const user = await this.MongoUserModel.findOne({
            'emailConfirmation.confirmationCode': code,
        });
        return user;
    }

    async findUserByRecoveryCodeOrNotFoundFail(
        code: string,
    ): Promise<MongoUserDocument> {
        const user = await this.MongoUserModel.findOne({
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
