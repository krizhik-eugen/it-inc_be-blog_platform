// import { InjectModel } from '@nestjs/mongoose';
// import { FilterQuery } from 'mongoose';
// import { PaginatedViewDto } from '../../../../core/dto';
// import {
//     Comment,
//     PostgresCommentModelType,
// } from '../../domain/comment.entity';
// import {
//     CommentViewDto,
//     PaginatedCommentsViewDto,
// } from '../../api/dto/view-dto';
// import { GetCommentsQueryParams } from '../../api/dto/query-params-dto';
// import { NotFoundDomainException } from '../../../../core/exceptions';
// import { LikeStatus } from '../../domain/like.entity';
// import { LikesQueryRepository } from './likes.query-repository';
// import { PostsRepository } from '../repositories/posts.postgres-repository';

// export class CommentsQueryRepository {
//     constructor(
//         @InjectModel(Comment.name)
//         private CommentModel: PostgresCommentModelType,
//         // @InjectModel(Post.name)
//         // private PostModel: MongoPostModelType,
//         private likesQueryRepository: LikesQueryRepository,
//         private postsRepository: PostsRepository,
//     ) {}

//     async getByIdOrNotFoundFail({
//         commentId,
//         userId,
//     }: {
//         commentId: string;
//         userId: number | null;
//     }): Promise<CommentViewDto> {
//         const comment = await this.CommentModel.findOne({
//             _id: commentId,
//             deletedAt: null,
//         }).exec();

//         if (!comment) {
//             throw NotFoundDomainException.create(
//                 'Comment is not found',
//             );
//         }

//         let likeStatus: LikeStatus = LikeStatus.None;

//         if (userId) {
//             likeStatus =
//                 await this.likesQueryRepository.getLikeStatusByUserIdAndParentId(
//                     { parentId: commentId, userId },
//                 );
//         }

//         return CommentViewDto.mapToView(comment, likeStatus);
//     }

//     async getAllPostComments({
//         query,
//         postId,
//         userId,
//     }: {
//         query: GetCommentsQueryParams;
//         postId: number;
//         userId: number | null;
//     }): Promise<PaginatedCommentsViewDto> {
//         await this.postsRepository.findByIdNonDeletedOrNotFoundFail(
//             postId,
//         );

//         const findQuery: FilterQuery<Comment> = {
//             postId: postId,
//             deletedAt: null,
//         };

//         const result = await this.CommentModel.find(findQuery)
//             .sort({ [query.sortBy]: query.sortDirection })
//             .skip(query.calculateSkip())
//             .limit(query.pageSize);

//         const commentsCount = await this.CommentModel.countDocuments(findQuery);
//         const commentsIds: string[] = [];
//         const mappedComments = result.map((comment) => {
//             commentsIds.push(comment._id.toString());
//             return CommentViewDto.mapToView(comment, LikeStatus.None);
//         });

//         if (userId) {
//             const likes = await this.likesQueryRepository.getLikesArray({
//                 parentIdsArray: commentsIds,
//                 userId,
//             });

//             mappedComments.forEach((comment) => {
//                 const like = likes.find((like) => like.parentId === comment.id);
//                 comment.likesInfo.myStatus = like?.status ?? LikeStatus.None;
//             });
//         }

//         return PaginatedViewDto.mapToView({
//             items: mappedComments,
//             page: query.pageNumber,
//             size: query.pageSize,
//             totalCount: commentsCount,
//         });
//     }
// }
