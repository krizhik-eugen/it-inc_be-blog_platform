import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('testing')
export class TestingController {
    constructor(private dataSource: DataSource) {}

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
                `TRUNCATE users, email_confirmation, password_recovery, sessions, blogs, posts, comments, likes RESTART IDENTITY CASCADE;`,
            ),
        ]);
    }
}
