import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure';
import { UserEntity } from '../domain/user.entity';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async findByIds(ids: number[]): Promise<UserEntity[]> {
        return this.usersRepository.findByIds(ids);
    }

    async findByIdOrNotFoundFail(id: number): Promise<UserEntity | null> {
        return this.usersRepository.findByIdOrNotFoundFail(id);
    }
}
