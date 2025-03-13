import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Post, PostModelType } from '../platform/domain/post.entity';
import { Like, LikeModelType } from '../platform/domain/like.entity';
import { Comment, CommentModelType } from '../platform/domain/comment.entity';

@Controller('testing')
export class TestingController {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
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
            // await this.BlogModel.deleteMany({}),
            await this.PostModel.deleteMany({}),
            await this.CommentModel.deleteMany({}),
            await this.LikeModel.deleteMany({}),
        ]);
    }
}
