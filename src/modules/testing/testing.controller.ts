import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Like, LikeModelType } from '../platform/domain/like.entity';

@Controller('testing')
export class TestingController {
    constructor(
        @InjectModel(Like.name)
        private LikeModel: LikeModelType,
        private dataSource: DataSource,
    ) {}

    @Delete('all-data')
    @ApiOperation({
        summary:
            'Clears database: deletes all data from all tables/collections',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'All data is deleted',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAll() {
        await Promise.all([
            await this.dataSource.query(
                `TRUNCATE users, email_confirmation, password_recovery RESTART IDENTITY CASCADE;`,
            ),
            await this.dataSource.query(
                `TRUNCATE sessions RESTART IDENTITY CASCADE;`,
            ),
            await this.dataSource.query(
                `TRUNCATE blogs RESTART IDENTITY CASCADE;`,
            ),
            await this.dataSource.query(
                `TRUNCATE posts RESTART IDENTITY CASCADE;`,
            ),
            await this.dataSource.query(
                `TRUNCATE comments RESTART IDENTITY CASCADE;`,
            ),

            await this.LikeModel.deleteMany({}),
        ]);
    }
}
