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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from '../../../core/pipes';
import { Public } from '../guards/decorators';
import { BasicAuthGuard } from '../guards/basic';
import {
    CreateUserApi,
    DeleteUserApi,
    GetUsersApi,
    UpdateUserApi,
} from './swagger';
import { CreateUserInputDto, UpdateUserInputDto } from './dto/input-dto';
import { GetUsersQueryParams } from './dto/query-params-dto';
import { PaginatedUsersViewDto, UserViewDto } from './dto/view-dto';
import { GetUserByIdQuery, GetUsersQuery } from '../application/queries/users';
import {
    CreateUserCommand,
    DeleteUserCommand,
    UpdateUserCommand,
} from '../application/use-cases/users';
import { UsersPostgresQueryRepository } from '../infrastructure';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        private usersPostgresQueryRepository: UsersPostgresQueryRepository,
    ) {}

    @Public()
    @Get('/postgres')
    @GetUsersApi()
    async getAllUsersPostgres() {
        return this.usersPostgresQueryRepository.getAllUsers();
    }

    @Public()
    @Get()
    @GetUsersApi()
    async getAllUsers(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedUsersViewDto> {
        return this.queryBus.execute<GetUsersQuery, PaginatedUsersViewDto>(
            new GetUsersQuery(query),
        );
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
        return this.queryBus.execute<GetUserByIdQuery, UserViewDto>(
            new GetUserByIdQuery(newUserId),
        );
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
