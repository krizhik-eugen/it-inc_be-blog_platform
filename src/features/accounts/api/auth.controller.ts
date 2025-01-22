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

@Controller('auth')
export class AuthController {
    // constructor(
    //     private authQueryRepository: AuthQueryRepository,
    //     private authService: AuthService,
    // ) {}
    // @Get()
    // getAllAuth(@Query() query: any) {
    //     return this.authQueryRepository.getAllAuth(query);
    // }
    // @Get(':id')
    // getUserById(@Param('id') id: string) {
    //     return this.authQueryRepository.getUserById(id);
    // }
    // @Post()
    // createUser(@Body() body: any) {
    //     this.authService.createUser(body);
    // }
    // @Delete(':id')
    // @HttpCode(HTTP_STATUS_CODES.NO_CONTENT)
    // deleteUser(@Param('id') id: string) {
    //     return this.authService.deleteUser(id);
    // }
}
