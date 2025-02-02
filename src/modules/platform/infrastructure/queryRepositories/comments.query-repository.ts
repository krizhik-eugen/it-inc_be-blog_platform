import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Comment, CommentModelType } from '../../domain/comment.entity';
import { LikeStatus } from '../../types';
import { Post, PostModelType } from '../../domain/post.entity';
import { CommentViewDto } from '../../api/dto/view-dto/comments.view-dto';
import { GetCommentsQueryParams } from '../../api/dto/query-params-dto/get-comments-query-params.input-dto';

export class CommentsQueryRepository {
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
        @InjectModel(Post.name)
        private PostModel: PostModelType,
    ) {}

    async getByIdOrNotFoundFail(
        id: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        userId: string | null,
    ): Promise<CommentViewDto> {
        const comment = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        }).exec();

        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        //TODO: get likes and my status
        return CommentViewDto.mapToView(comment, LikeStatus.None);
    }

    async getAllPostComments(
        query: GetCommentsQueryParams,
        postId: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        userId: string | null,
    ): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const post = await this.PostModel.findOne({
            _id: postId,
            deletedAt: null,
        });

        if (!post) {
            throw new NotFoundException('post not found');
        }

        const findQuery: FilterQuery<Comment> = {
            postId: postId,
            deletedAt: null,
        };

        const result = await this.CommentModel.find(findQuery)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);

        const commentsCount = await this.CommentModel.countDocuments(findQuery);

        //TODO: get likes and newest likes
        const mappedComments = result.map((comment) =>
            CommentViewDto.mapToView(comment, LikeStatus.None),
        );

        return PaginatedViewDto.mapToView({
            items: mappedComments,
            page: query.pageNumber,
            size: query.pageSize,
            totalCount: commentsCount,
        });
    }
}
