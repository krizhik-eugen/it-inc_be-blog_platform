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
import { GetUsersQueryParams } from './dto/query-params-dto/get-users-query-params.input-dto';
import {
    PaginatedUsersViewDto,
    UserViewDto,
} from './dto/view-dto/users.view-dto';
import { CreateUserInputDto } from './dto/input-dto/users.input-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Returns all users',
    })
    @ApiResponse({
        status: HTTP_STATUS_CODES.OK,
        description: 'Success',
        type: PaginatedUsersViewDto,
    })
    async getAllUsers(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedUsersViewDto> {
        return await this.usersQueryRepository.getAllUsers(query);
    }

    @Post()
    @ApiOperation({
        summary: 'Adds new user to the system',
    })
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
        return await this.usersQueryRepository.getByIdOrNotFoundFail(newUserId);
    }

    @ApiParam({
        name: 'id',
    })
    @ApiOperation({
        summary: 'Deletes user by id',
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
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id);
    }
}
