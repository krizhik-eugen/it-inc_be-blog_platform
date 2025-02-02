import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../../domain/user.entity';

export class UsersRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

    async save(user: UserDocument) {
        return await user.save();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByIdOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }

    async findByIdNonDeletedOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!user) {
            throw new NotFoundException('user not found');
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

    async findByLoginOrEmailNonDeletedOrNotFoundFail(
        loginOrEmail: string,
    ): Promise<UserDocument> {
        const user = await this.UserModel.findOne()
            .and([{ deletedAt: null }])
            .or([{ login: loginOrEmail }, { email: loginOrEmail }]);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    async findUserByConfirmationCodeOrNotFoundFail(
        code: string,
    ): Promise<UserDocument> {
        const user = await this.UserModel.findOne({
            'emailConfirmation.confirmationCode': code,
        });
        if (!user) {
            throw new NotFoundException(
                'No user found for this confirmation code',
            );
        }
        return user;
    }
}
