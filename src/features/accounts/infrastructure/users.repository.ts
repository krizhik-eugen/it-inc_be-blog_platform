import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';

export class UsersRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

    async findById(id: string): Promise<UserDocument | null> {
        return this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(user: UserDocument) {
        await user.save();
    }

    async findOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }

    async findNonDeletedOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }
}
