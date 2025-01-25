import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { HTTP_STATUS_CODES } from 'src/constants';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';
import { UsersQueryRepository } from '../infrastructure/queryRepositories/users.query-repository';
import { UsersService } from '../application/users.service';
import { GetUsersQueryParams } from './dto/get-users-query-params.input-dto';
import { UserViewDto } from './dto/users.view-dto';
import { CreateUserInputDto } from './dto/users.input-dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) {}

    @Get()
    getAllUsers(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedViewDto<UserViewDto[]>> {
        return this.usersQueryRepository.getAllUsers(query);
    }

    @Post()
    async createUser(@Body() body: CreateUserInputDto) {
        const newUserId = await this.usersService.createUser(body);
        return this.usersQueryRepository.getByIdOrNotFoundFail(newUserId);
    }

    @Delete(':id')
    @HttpCode(HTTP_STATUS_CODES.NO_CONTENT)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
