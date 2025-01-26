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
import { HTTP_STATUS_CODES } from '../../../constants';
import { UsersQueryRepository } from '../infrastructure/queryRepositories/users.query-repository';
import { UsersService } from '../application/users.service';
import { GetUsersQueryParams } from './dto/get-users-query-params.input-dto';
import { PaginatedUsersViewDto, UserViewDto } from './dto/users.view-dto';
import { CreateUserInputDto } from './dto/users.input-dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) {}

    @Get()
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: PaginatedUsersViewDto,
    })
    getAllUsers(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedUsersViewDto> {
        return this.usersQueryRepository.getAllUsers(query);
    }

    @Post()
    @ApiBody({
        type: CreateUserInputDto,
        description: 'Data for constructing new user',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.CREATED,
        description: 'Returns the newly created user',
        type: UserViewDto,
    })
    async createUser(@Body() body: CreateUserInputDto) {
        const newUserId = await this.usersService.createUser(body);
        return this.usersQueryRepository.getByIdOrNotFoundFail(newUserId);
    }

    @ApiParam({
        name: 'id',
        description: 'User id',
    })
    @Delete(':id')
    @ApiResponse({
        status: HTTP_STATUS_CODES.NO_CONTENT,
        description: 'No content',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        description: 'If specified user does not exist',
    })
    @HttpCode(HTTP_STATUS_CODES.NO_CONTENT)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
