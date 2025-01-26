import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UserViewDto } from '../../api/dto/view-dto/users.view-dto';
import { GetUsersQueryParams } from '../../api/dto/query-params-dto/get-users-query-params.input-dto';
import { User, UserModelType } from '../../domain/user.entity';

export class UsersQueryRepository {
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
    ) {}

    async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        }).exec();

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return UserViewDto.mapToView(user);
    }

    async getAllUsers(
        query: GetUsersQueryParams,
    ): Promise<PaginatedViewDto<UserViewDto[]>> {
        const findQuery: FilterQuery<User> = { deletedAt: null };
        const searchConditions: FilterQuery<User>[] = [];

        if (query.searchLoginTerm) {
            searchConditions.push({
                login: { $regex: query.searchLoginTerm, $options: 'i' },
            });
        }

        if (query.searchEmailTerm) {
            searchConditions.push({
                email: { $regex: query.searchEmailTerm, $options: 'i' },
            });
        }

        if (searchConditions.length > 0) {
            findQuery.$or = searchConditions;
        }

        const result = await this.UserModel.find(findQuery)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);

        const usersCount = await this.UserModel.countDocuments(findQuery);

        const mappedUsers = result.map((user) => UserViewDto.mapToView(user));

        return PaginatedViewDto.mapToView({
            items: mappedUsers,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: usersCount,
        });
    }
}
