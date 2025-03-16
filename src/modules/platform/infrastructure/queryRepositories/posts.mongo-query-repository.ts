// import { InjectModel } from '@nestjs/mongoose';
// import { FilterQuery } from 'mongoose';
// import { PaginatedViewDto } from '../../../../core/dto';
// import { GetPostsQueryParams } from '../../api/dto/query-params-dto';
// import { MongoPost, MongoPostModelType } from '../../domain/post.entity';
// import { PostViewDto } from '../../api/dto/view-dto';
// import { NotFoundDomainException } from '../../../../core/exceptions';
// import { LikeStatus } from '../../domain/like.entity';
// import { LikesQueryRepository } from './likes.query-repository';
// import { PostgresBlogsRepository } from '../repositories/blogs.postgres-repository';

// export class PostsQueryRepository {
//     constructor(
//         @InjectModel(MongoPost.name)
//         private PostModel: MongoPostModelType,
//         // @InjectModel(MongoBlog.name)
//         // private BlogModel: MongoBlogModelType,
//         private likesQueryRepository: LikesQueryRepository,
//         private postgresBlogsRepository: PostgresBlogsRepository,
//     ) {}

//     async getByIdOrNotFoundFail({
//         postId,
//         userId,
//     }: {
//         postId: string;
//         userId: number | null;
//     }): Promise<PostViewDto> {
//         const post = await this.PostModel.findOne({
//             _id: postId,
//             deletedAt: null,
//         }).exec();

//         if (!post) {
//             throw NotFoundDomainException.create('MongoPost not found');
//         }

//         let likeStatus: LikeStatus = LikeStatus.None;

//         if (userId) {
//             likeStatus =
//                 await this.likesQueryRepository.getLikeStatusByUserIdAndParentId(
//                     { parentId: postId, userId },
//                 );
//         }

//         const newestLikes =
//             await this.likesQueryRepository.getLastThreeLikes(postId);

//         return PostViewDto.mapToView(post, likeStatus, newestLikes);
//     }

//     async getAllPosts({
//         query,
//         userId,
//     }: {
//         query: GetPostsQueryParams;
//         userId: number | null;
//     }): Promise<PaginatedViewDto<PostViewDto[]>> {
//         const findQuery: FilterQuery<MongoPost> = { deletedAt: null };

//         const result = await this.PostModel.find(findQuery)
//             .sort({ [query.sortBy]: query.sortDirection })
//             .skip(query.calculateSkip())
//             .limit(query.pageSize);

//         const postsCount = await this.PostModel.countDocuments(findQuery);
//         const postsIds: string[] = [];

//         const mappedPosts = result.map((post) => {
//             postsIds.push(post._id.toString());
//             return PostViewDto.mapToView(post, LikeStatus.None, []);
//         });

//         if (userId) {
//             const likes = await this.likesQueryRepository.getLikesArray({
//                 parentIdsArray: postsIds,
//                 userId,
//             });
//             mappedPosts.forEach((post) => {
//                 const like = likes.find((like) => like.parentId === post.id);
//                 post.extendedLikesInfo.myStatus =
//                     like?.status ?? LikeStatus.None;
//             });
//         }

//         for (const post of mappedPosts) {
//             post.extendedLikesInfo.newestLikes =
//                 await this.likesQueryRepository.getLastThreeLikes(post.id);
//         }

//         return PaginatedViewDto.mapToView({
//             items: mappedPosts,
//             page: query.pageNumber,
//             size: query.pageSize,
//             totalCount: postsCount,
//         });
//     }

//     async getAllBlogPosts({
//         query,
//         blogId,
//         userId,
//     }: {
//         query: GetPostsQueryParams;
//         blogId: number;
//         userId: number | null;
//     }): Promise<PaginatedViewDto<PostViewDto[]>> {
//         await this.postgresBlogsRepository.findByIdNonDeletedOrNotFoundFail(
//             blogId,
//         );

//         const findQuery: FilterQuery<MongoPost> = {
//             blogId: blogId,
//             deletedAt: null,
//         };

//         const result = await this.PostModel.find(findQuery)
//             .sort({ [query.sortBy]: query.sortDirection })
//             .skip(query.calculateSkip())
//             .limit(query.pageSize);

//         const postsCount = await this.PostModel.countDocuments(findQuery);
//         const postsIds: string[] = [];

//         const mappedPosts = result.map((post) => {
//             postsIds.push(post._id.toString());
//             return PostViewDto.mapToView(post, LikeStatus.None, []);
//         });

//         if (userId) {
//             const likes = await this.likesQueryRepository.getLikesArray({
//                 parentIdsArray: postsIds,
//                 userId,
//             });
//             mappedPosts.forEach((post) => {
//                 const like = likes.find((like) => like.parentId === post.id);
//                 post.extendedLikesInfo.myStatus =
//                     like?.status ?? LikeStatus.None;
//             });
//         }

//         for (const post of mappedPosts) {
//             post.extendedLikesInfo.newestLikes =
//                 await this.likesQueryRepository.getLastThreeLikes(post.id);
//         }

//         return PaginatedViewDto.mapToView({
//             items: mappedPosts,
//             page: query.pageNumber,
//             size: query.pageSize,
//             totalCount: postsCount,
//         });
//     }
// }
