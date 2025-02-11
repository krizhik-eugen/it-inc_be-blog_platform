import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation-transformation-pipe.service';
import { UsersQueryRepository } from '../infrastructure/queryRepositories/users.query-repository';
import { GetUsersQueryParams } from './dto/query-params-dto/get-users-query-params.input-dto';
import {
    PaginatedUsersViewDto,
    UserViewDto,
} from './dto/view-dto/users.view-dto';
import {
    CreateUserInputDto,
    UpdateUserInputDto,
} from './dto/input-dto/users.input-dto';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import {
    CreateUserApi,
    DeleteUserApi,
    GetUsersApi,
    UpdateUserApi,
} from './swagger/users.decorators';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';
import { UpdateUserCommand } from '../application/use-cases/update-user.use-case';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private commandBus: CommandBus,
    ) {}

    @Get()
    @GetUsersApi()
    async getAllUsers(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedUsersViewDto> {
        return await this.usersQueryRepository.getAllUsers(query);
    }

    @Post()
    @CreateUserApi()
    async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
        const newUserId = await this.commandBus.execute<
            CreateUserCommand,
            string
        >(new CreateUserCommand(body));
        return await this.usersQueryRepository.getByIdOrNotFoundFail(newUserId);
    }

    @Put(':id')
    @UpdateUserApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateUser(
        @Param('id', ObjectIdValidationPipe) id: string,
        @Body() body: UpdateUserInputDto,
    ): Promise<void> {
        return await this.commandBus.execute<UpdateUserCommand, void>(
            new UpdateUserCommand(id, body),
        );
    }

    @Delete(':id')
    @DeleteUserApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(
        @Param('id', ObjectIdValidationPipe) id: string,
    ): Promise<void> {
        return await this.commandBus.execute<DeleteUserCommand, void>(
            new DeleteUserCommand(id),
        );
    }
}
