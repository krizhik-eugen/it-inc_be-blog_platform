import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions';
import {
    MeViewDto,
    PaginatedUsersViewDto,
    UserViewDto,
} from '../../api/dto/view-dto';
import { GetUsersQueryParams } from '../../api/dto/query-params-dto';
import { MongoUser, MongoUserModelType } from '../../domain/user.entity';

export class UsersMongoQueryRepository {
    constructor(
        @InjectModel(MongoUser.name)
        private MongoUserModel: MongoUserModelType,
    ) {}

    async getCurrentUserByIdOrNotFoundFail(id: string): Promise<MeViewDto> {
        const user = await this.MongoUserModel.findOne({
            _id: id,
            deletedAt: null,
        }).exec();

        if (!user) {
            throw NotFoundDomainException.create('MongoUser is not found');
        }

        return MeViewDto.mapToView(user);
    }

    async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
        const user = await this.MongoUserModel.findOne({
            _id: id,
            deletedAt: null,
        }).exec();

        if (!user) {
            throw NotFoundDomainException.create('MongoUser is not found');
        }

        return UserViewDto.mapToView(user);
    }

    async getAllUsers(
        query: GetUsersQueryParams,
    ): Promise<PaginatedUsersViewDto> {
        const findQuery: FilterQuery<MongoUser> = { deletedAt: null };
        const searchConditions: FilterQuery<MongoUser>[] = [];

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

        const result = await this.MongoUserModel.find(findQuery)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);

        const usersCount = await this.MongoUserModel.countDocuments(findQuery);

        const mappedUsers = result.map((user) => UserViewDto.mapToView(user));

        return PaginatedUsersViewDto.mapToView({
            items: mappedUsers,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: usersCount,
        });
    }
}
