import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create/create-user.dto';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { SALT_ROUNDS } from '../../../constants';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
    ) {}

    async createUser(dto: CreateUserDto): Promise<string> {
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

        const user = this.UserModel.createConfirmedInstance({
            email: dto.email,
            login: dto.login,
            passwordHash,
        });

        await this.usersRepository.save(user);

        return user._id.toString();
    }

    async deleteUser(id: string) {
        const user =
            await this.usersRepository.findByIdNonDeletedOrNotFoundFail(id);

        user.makeDeleted();

        await this.usersRepository.save(user);
    }
}
