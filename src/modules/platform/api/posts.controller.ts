import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    JwtAuthGuard,
    JwtOptionalAuthGuard,
} from '../../../modules/accounts/guards/bearer';
import {
    CreateCommentApi,
    GetAllPostCommentsApi,
    GetAllPostsApi,
    GetPostApi,
    UpdatePostCommentLikeStatusApi,
} from './swagger';
import {
    ExtractUserFromRequest,
    ExtractUserIfExistsFromRequest,
} from '../../../modules/accounts/guards/decorators';
import { UserContextDto } from '../../../modules/accounts/guards/dto';
import {
    GetCommentsQueryParams,
    GetPostsQueryParams,
} from './dto/query-params-dto';

import {
    GetCommentsQuery,
    GetPostByIdQuery,
    GetPostsQuery,
} from '../application/queries/posts';
import { PaginatedPostsViewDto, PostViewDto } from './dto/view-dto';
import { CreateCommentInputDto } from './dto/input-dto/create';
import { CreateCommentCommand } from '../application/use-cases/posts';
import {
    CommentViewDto,
    PaginatedCommentsViewDto,
} from './dto/view-dto/comments.view-dto';
import { GetCommentByIdQuery } from '../application/queries/comments';
import { UpdateLikeInputDto } from './dto/input-dto/update';
import { UpdateLikeStatusCommand } from '../application/use-cases/likes';
import { LikeParentType } from '../domain/like.entity';

@Controller('posts')
export class PostsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Put(':postId/like-status')
    @UpdatePostCommentLikeStatusApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCommentLikeStatus(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() body: UpdateLikeInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<void> {
        return this.commandBus.execute<UpdateLikeStatusCommand, void>(
            new UpdateLikeStatusCommand(
                body,
                postId,
                LikeParentType.Post,
                user.id,
            ),
        );
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':postId/comments')
    @GetAllPostCommentsApi()
    async getAllPostComments(
        @Param('postId', ParseIntPipe) postId: number,
        @Query() query: GetCommentsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PaginatedCommentsViewDto> {
        return this.queryBus.execute<
            GetCommentsQuery,
            PaginatedCommentsViewDto
        >(new GetCommentsQuery(query, postId, user?.id));
    }

    @UseGuards(JwtAuthGuard)
    @Post(':postId/comments')
    @CreateCommentApi()
    async createComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() body: CreateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<CommentViewDto> {
        const newCommentId = await this.commandBus.execute<
            CreateCommentCommand,
            number
        >(new CreateCommentCommand(postId, user.id, body));

        return this.queryBus.execute<GetCommentByIdQuery, CommentViewDto>(
            new GetCommentByIdQuery(newCommentId, user.id),
        );
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get()
    @GetAllPostsApi()
    async getAllPosts(
        @Query() query: GetPostsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PaginatedPostsViewDto> {
        return this.queryBus.execute<GetPostsQuery, PaginatedPostsViewDto>(
            new GetPostsQuery(query, user?.id),
        );
    }

    // @UseGuards(BasicAuthGuard)
    // @Post()
    // @CreatePostApi()
    // async createPost(
    //     @Body() body: CreatePostInputDto,
    // ): Promise<MongoPostViewDto> {
    //     const newPostId = await this.commandBus.execute<
    //         CreatePostCommand,
    //         string
    //     >(new CreatePostCommand(body));

    //     return this.queryBus.execute<GetPostByIdQuery, MongoPostViewDto>(
    //         new GetPostByIdQuery(newPostId, null),
    //     );
    // }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':postId')
    @GetPostApi()
    async getPost(
        @Param('postId', ParseIntPipe) postId: number,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PostViewDto> {
        return this.queryBus.execute(new GetPostByIdQuery(postId, user?.id));
    }

    // @UseGuards(BasicAuthGuard)
    // @Put(':postId')
    // @UpdatePostApi()
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async updatePost(
    //     @Param('postId', ObjectIdValidationPipe) postId: string,
    //     @Body() body: UpdatePostInputDto,
    // ): Promise<void> {
    //     return this.commandBus.execute<UpdatePostCommand, void>(
    //         new UpdatePostCommand(postId, body),
    //     );
    // }

    // @UseGuards(BasicAuthGuard)
    // @Delete(':postId')
    // @DeletePostApi()
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async deletePost(
    //     @Param('postId', ObjectIdValidationPipe) postId: string,
    // ): Promise<void> {
    //     return this.commandBus.execute<DeletePostCommand, void>(
    //         new DeletePostCommand(postId),
    //     );
    // }
}
