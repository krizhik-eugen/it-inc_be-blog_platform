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
import { MongoUserViewDto, PostgresUserViewDto } from './dto/view-dto';
import { GetUserByIdQuery, GetUsersQuery } from '../application/queries/users';
import { PaginatedPostgresUsersViewDto } from './dto/view-dto/users.view-dto';
import {
    CreateUserCommand,
    DeleteUserCommand,
    UpdateUserCommand,
} from '../application/use-cases/users';

@Controller('/sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @Public()
    @Get()
    @GetUsersApi()
    async getAllUsers(
        @Query() query: GetUsersQueryParams,
    ): Promise<PaginatedPostgresUsersViewDto> {
        return this.queryBus.execute<
            GetUsersQuery,
            PaginatedPostgresUsersViewDto
        >(new GetUsersQuery(query));
    }

    @Post()
    @CreateUserApi()
    async createUser(
        @Body() body: CreateUserInputDto,
    ): Promise<MongoUserViewDto> {
        const newUserId = await this.commandBus.execute<
            CreateUserCommand,
            number
        >(
            new CreateUserCommand({
                email: body.email,
                login: body.login,
                password: body.password,
            }),
        );
        return this.queryBus.execute<GetUserByIdQuery, PostgresUserViewDto>(
            new GetUserByIdQuery(newUserId),
        );
    }

    @Put(':userId')
    @UpdateUserApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateUser(
        // @Param('userId', ObjectIdValidationPipe) userId: string,
        @Param('userId') userId: number,
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
        // @Param('userId', ObjectIdValidationPipe) userId: string,
        @Param('userId') userId: number,
    ): Promise<void> {
        return this.commandBus.execute<DeleteUserCommand, void>(
            new DeleteUserCommand(userId),
        );
    }
}
