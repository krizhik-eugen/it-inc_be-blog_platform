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
import { CommandBus } from '@nestjs/cqrs';
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
        return this.usersQueryRepository.getAllUsers(query);
    }

    @Post()
    @CreateUserApi()
    async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
        const newUserId = await this.commandBus.execute<
            CreateUserCommand,
            string
        >(
            new CreateUserCommand({
                email: body.email,
                login: body.login,
                password: body.password,
            }),
        );
        return this.usersQueryRepository.getByIdOrNotFoundFail(newUserId);
    }

    @Put(':userId')
    @UpdateUserApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateUser(
        @Param('userId', ObjectIdValidationPipe) userId: string,
        @Body() body: UpdateUserInputDto,
    ): Promise<void> {
        return this.commandBus.execute<UpdateUserCommand, void>(
            new UpdateUserCommand(userId, {
                email: body.email,
            }),
        );
    }

    @Delete(':userId')
    @DeleteUserApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(
        @Param('userId', ObjectIdValidationPipe) userId: string,
    ): Promise<void> {
        return this.commandBus.execute<DeleteUserCommand, void>(
            new DeleteUserCommand(userId),
        );
    }
}
