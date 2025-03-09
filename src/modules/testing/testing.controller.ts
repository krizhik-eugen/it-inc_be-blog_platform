import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MongoUser, MongoUserModelType } from '../accounts/domain/user.entity';
import { Blog, BlogModelType } from '../platform/domain/blog.entity';
import { Post, PostModelType } from '../platform/domain/post.entity';
import { Like, LikeModelType } from '../platform/domain/like.entity';
import { Comment, CommentModelType } from '../platform/domain/comment.entity';
import { Session, SessionModelType } from '../accounts/domain/session.entity';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
    constructor(
        @InjectModel(MongoUser.name)
        private MongoUserModel: MongoUserModelType,
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
        @InjectModel(Session.name)
        private SessionModel: SessionModelType,
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
        await this.MongoUserModel.deleteMany({});
        await this.BlogModel.deleteMany({});
        await this.PostModel.deleteMany({});
        await this.CommentModel.deleteMany({});
        await this.SessionModel.deleteMany({});
        await this.LikeModel.deleteMany({});
        await this.dataSource.query(
            `TRUNCATE users, email_confirmation, password_recovery RESTART IDENTITY CASCADE;`,
        );
    }
}
