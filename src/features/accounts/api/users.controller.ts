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

@Controller('users')
export class UsersController {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) {}

    @Get()
    getAllUsers(@Query() query: any) {
        return this.usersQueryRepository.getAllUsers(query);
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.usersQueryRepository.getUserById(id);
    }

    @Post()
    createUser(@Body() body: any) {
        this.usersService.createUser(body);
    }

    @Delete(':id')
    @HttpCode(HTTP_STATUS_CODES.NO_CONTENT)
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
