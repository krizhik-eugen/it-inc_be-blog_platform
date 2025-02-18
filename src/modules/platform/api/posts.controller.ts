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
import { UpdatePostCommand } from '../application/use-cases/posts/update-post.use-case';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import {
    PaginatedPostsViewDto,
    PostViewDto,
} from './dto/view-dto/posts.view-dto';
import { CreatePostInputDto } from './dto/input-dto/create/posts.input-dto';
import { UpdatePostInputDto } from './dto/input-dto/update/posts.input-dto';
import {
    CommentViewDto,
    PaginatedCommentsViewDto,
} from './dto/view-dto/comments.view-dto';
import { GetCommentsQueryParams } from './dto/query-params-dto/get-comments-query-params.input-dto';
import { ObjectIdValidationPipe } from '../../../core/pipes';
import { CreatePostCommand } from '../application/use-cases/posts/create-post.use-case';
import { DeletePostCommand } from '../application/use-cases/posts/delete-post.use-case';
import { BasicAuthGuard } from '../../accounts/guards/basic/basic-auth.guard';
import { JwtAuthGuard } from '../../accounts/guards/bearer/jwt-auth.guard';
import {
    CreateCommentApi,
    CreatePostApi,
    DeletePostApi,
    GetAllPostCommentsApi,
    GetAllPostsApi,
    GetPostApi,
    UpdateCommentLikeStatusApi,
    UpdatePostApi,
} from './swagger/posts.decorators';
import { CreateCommentInputDto } from './dto/input-dto/create/comments.input-dto';
import { CreateCommentCommand } from '../application/use-cases/posts/create-post-comment.use-case';
import { ExtractUserFromRequest } from '../../accounts/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../accounts/guards/dto/user-context.dto';
import { JwtOptionalAuthGuard } from '../../accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../accounts/guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { UpdateLikeInputDto } from './dto/input-dto/update/likes.input-dto';
import { UpdatePostLikeStatusCommand } from '../application/use-cases/posts/update-post-like-status.use-case';
import { GetPostByIdQuery } from '../application/queries/posts/get-post-by-id.query-handler';
import { GetPostsQuery } from '../application/queries/posts/get-posts.query-handler';
import { GetCommentByIdQuery } from '../application/queries/comments/get-comment-by-id.query-handler';
import { GetCommentsQuery } from '../application/queries/posts/get-post-comments.query-handler';

@Controller('posts')
export class PostsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Put(':postId/like-status')
    @UpdateCommentLikeStatusApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCommentLikeStatus(
        @Param('postId', ObjectIdValidationPipe) postId: string,
        @Body() body: UpdateLikeInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<void> {
        return this.commandBus.execute<UpdatePostLikeStatusCommand, void>(
            new UpdatePostLikeStatusCommand(postId, body, user.id),
        );
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':postId/comments')
    @GetAllPostCommentsApi()
    async getAllPostComments(
        @Param('postId', ObjectIdValidationPipe) postId: string,
        @Query() query: GetCommentsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PaginatedCommentsViewDto> {
        return this.queryBus.execute(
            new GetCommentsQuery(query, postId, user?.id),
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post(':postId/comments')
    @CreateCommentApi()
    async createComment(
        @Param('postId', ObjectIdValidationPipe) postId: string,
        @Body() body: CreateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<CommentViewDto> {
        const newCommentId = await this.commandBus.execute<
            CreateCommentCommand,
            string
        >(new CreateCommentCommand(postId, user.id, body));

        return this.queryBus.execute(
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
        return this.queryBus.execute(new GetPostsQuery(query, user?.id));
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    @CreatePostApi()
    async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
        const newPostId = await this.commandBus.execute<
            CreatePostCommand,
            string
        >(new CreatePostCommand(body));

        return this.queryBus.execute(new GetPostByIdQuery(newPostId, null));
    }

    @UseGuards(JwtOptionalAuthGuard)
    @Get(':postId')
    @GetPostApi()
    async getPost(
        @Param('postId', ObjectIdValidationPipe) postId: string,
        @ExtractUserIfExistsFromRequest() user: UserContextDto,
    ): Promise<PostViewDto> {
        return this.queryBus.execute(new GetPostByIdQuery(postId, user?.id));
    }

    @UseGuards(BasicAuthGuard)
    @Put(':postId')
    @UpdatePostApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param('postId', ObjectIdValidationPipe) postId: string,
        @Body() body: UpdatePostInputDto,
    ): Promise<void> {
        return this.commandBus.execute<UpdatePostCommand, void>(
            new UpdatePostCommand(postId, body),
        );
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':postId')
    @DeletePostApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(
        @Param('postId', ObjectIdValidationPipe) postId: string,
    ): Promise<void> {
        return this.commandBus.execute<DeletePostCommand, void>(
            new DeletePostCommand(postId),
        );
    }
}
