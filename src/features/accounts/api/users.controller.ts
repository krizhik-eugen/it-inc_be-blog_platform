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
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';
import { UsersQueryRepository } from '../infrastructure/queryRepositories/users.query-repository';
import { UsersService } from '../application/users.service';
import { GetUsersQueryParams } from './dto/query-params-dto/get-users-query-params.input-dto';
import {
    PaginatedUsersViewDto,
    UserViewDto,
} from './dto/view-dto/users.view-dto';
import { CreateUserInputDto } from './dto/input-dto/users.input-dto';

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
    @ApiOkResponse({
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
    @ApiCreatedResponse({
        description: 'Returns the newly created user',
        type: UserViewDto,
    })
    @ApiBody({
        type: CreateUserInputDto,
        description: 'Data for constructing new user',
    })
    async createUser(@Body() body: CreateUserInputDto) {
        const newUserId = await this.usersService.createUser(body);
        return await this.usersQueryRepository.getByIdOrNotFoundFail(newUserId);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Deletes user by id',
    })
    @ApiNoContentResponse({
        description: 'No content',
    })
    @ApiNotFoundResponse({
        description: 'If specified user does not exist',
    })
    @ApiParam({
        name: 'id',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id', ObjectIdValidationPipe) id: string) {
        return await this.usersService.deleteUser(id);
    }
}
