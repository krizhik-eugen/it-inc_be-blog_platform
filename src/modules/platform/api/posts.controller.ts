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
import { PostsQueryRepository } from '../infrastructure/queryRepositories/posts.query-repository';
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
import { CommentsQueryRepository } from '../infrastructure/queryRepositories/comments.query-repository';
import { GetCommentsQueryParams } from './dto/query-params-dto/get-comments-query-params.input-dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation-transformation-pipe.service';
import { CommandBus } from '@nestjs/cqrs';
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
    UpdatePostApi,
} from './swagger/posts.decorators';
import { CreateCommentInputDto } from './dto/input-dto/create/comments.input-dto';
import { CreateCommentCommand } from '../application/use-cases/posts/create-post-comment.use-case';
import { ExtractUserFromRequest } from '../../accounts/guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../../accounts/guards/dto/user-context.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private commentsQueryRepository: CommentsQueryRepository,
        private commandBus: CommandBus,
    ) {}

    @Get(':postId/comments')
    @GetAllPostCommentsApi()
    async getAllPostComments(
        @Param('postId', ObjectIdValidationPipe) postId: string,
        @Query() query: GetCommentsQueryParams,
    ): Promise<PaginatedCommentsViewDto> {
        return await this.commentsQueryRepository.getAllPostComments(
            query,
            postId,
            null,
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

        return await this.commentsQueryRepository.getByIdOrNotFoundFail(
            newCommentId,
            user.id,
        );
    }

    @Get()
    @GetAllPostsApi()
    async getAllPosts(
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedPostsViewDto> {
        return await this.postsQueryRepository.getAllPosts(query, null);
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    @CreatePostApi()
    async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
        const newPostId = await this.commandBus.execute<
            CreatePostCommand,
            string
        >(new CreatePostCommand(body));

        return await this.postsQueryRepository.getByIdOrNotFoundFail(
            newPostId,
            null,
        );
    }

    @Get(':id')
    @GetPostApi()
    async getPost(
        @Param('id', ObjectIdValidationPipe) id: string,
    ): Promise<PostViewDto> {
        return await this.postsQueryRepository.getByIdOrNotFoundFail(id, null);
    }

    @UseGuards(BasicAuthGuard)
    @Put(':id')
    @UpdatePostApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param('id', ObjectIdValidationPipe) id: string,
        @Body() body: UpdatePostInputDto,
    ): Promise<void> {
        return await this.commandBus.execute<UpdatePostCommand, void>(
            new UpdatePostCommand(id, body),
        );
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    @DeletePostApi()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(
        @Param('id', ObjectIdValidationPipe) id: string,
    ): Promise<void> {
        return await this.commandBus.execute<DeletePostCommand, void>(
            new DeletePostCommand(id),
        );
    }
}
