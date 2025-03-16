// import { InjectModel } from '@nestjs/mongoose';
// import {
//     MongoPost,
//     MongoPostDocument,
//     MongoPostModelType,
// } from '../../domain/post.entity';
// import { NotFoundDomainException } from '../../../../core/exceptions';

// export class MongoPostsRepository {
//     constructor(
//         @InjectModel(MongoPost.name) private PostModel: MongoPostModelType,
//     ) {}

//     async save(post: MongoPostDocument) {
//         return post.save();
//     }

//     async findById(id: string): Promise<MongoPostDocument | null> {
//         return this.PostModel.findOne({
//             _id: id,
//             deletedAt: null,
//         });
//     }

//     async findByIdOrNotFoundFail(id: string): Promise<MongoPostDocument> {
//         const post = await this.findById(id);

//         if (!post) {
//             throw NotFoundDomainException.create('MongoPost not found');
//         }

//         return post;
//     }

//     async findByIdNonDeletedOrNotFoundFail(
//         id: string,
//     ): Promise<MongoPostDocument> {
//         const post = await this.PostModel.findOne({
//             _id: id,
//             deletedAt: null,
//         });
//         if (!post) {
//             throw NotFoundDomainException.create('MongoPost not found');
//         }
//         return post;
//     }

//     async findAllByBlogIdNonDeleted(
//         blogId: string,
//     ): Promise<MongoPostDocument[]> {
//         return this.PostModel.find({
//             blogId: blogId,
//             deletedAt: null,
//         });
//     }

//     async deleteAllByBlogId(blogId: string): Promise<void> {
//         await this.PostModel.updateMany(
//             { blogId: blogId, deletedAt: null },
//             { deletedAt: new Date().toISOString() },
//         );
//     }
// }
