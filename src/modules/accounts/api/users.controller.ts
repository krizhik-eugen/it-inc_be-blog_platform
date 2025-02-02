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
    UseGuards,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';
import { UsersQueryRepository } from '../infrastructure/queryRepositories/users.query-repository';
import { UsersService } from '../application/users.service';
import { GetUsersQueryParams } from './dto/query-params-dto/get-users-query-params.input-dto';
import { PaginatedUsersViewDto } from './dto/view-dto/users.view-dto';
import { CreateUserInputDto } from './dto/input-dto/users.input-dto';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import {
    CreateUserApi,
    DeleteUserApi,
    GetUsersApi,
} from './swagger/users.decorators';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
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
    async createUser(@Body() body: CreateUserInputDto) {
        const newUserId = await this.usersService.createUser(body);
        return await this.usersQueryRepository.getByIdOrNotFoundFail(newUserId);
    }

    @Delete(':id')
    @DeleteUserApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id', ObjectIdValidationPipe) id: string) {
        return await this.usersService.deleteUser(id);
    }
}
