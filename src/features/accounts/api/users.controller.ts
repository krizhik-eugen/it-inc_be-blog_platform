import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
} from '@nestjs/common';
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
        status: HttpStatus.OK,
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
        status: HttpStatus.CREATED,
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
        status: HttpStatus.NO_CONTENT,
        description: 'No content',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'If specified user does not exist',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id);
    }
}
