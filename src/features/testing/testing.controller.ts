import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse } from '@nestjs/swagger';
import { User, UserModelType } from '../accounts/domain/user.entity';

@Controller('testing')
export class TestingController {
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
    ) {}

    @Delete('all-data')
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'All data is deleted',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAll() {
        await this.UserModel.deleteMany({});
    }
}
