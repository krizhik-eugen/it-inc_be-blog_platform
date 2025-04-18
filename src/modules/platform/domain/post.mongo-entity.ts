// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Model } from 'mongoose';
// import { NotFoundDomainException } from '../../../core/exceptions';
// import { CreatePostDomainDto } from './dto/create';
// import { UpdatePostDomainDto } from './dto/update';
// import { ParentLikesEntity } from './parent-likes.entity';

// /**
//  * Post Entity Schema
//  * This class represents the schema and behavior of a Post entity.
//  */
// @Schema({ timestamps: true })
// export class Post extends ParentLikesEntity {
//     /**
//      * Id of the blog that the post belongs to
//      * @type {number}
//      * @required
//      */
//     @Prop({
//         type: Number,
//         required: true,
//     })
//     blogId: number;

//     /**
//      * Name of the blog that the post belongs to
//      * @type {string}
//      * @required
//      */
//     @Prop({
//         type: String,
//         required: true,
//     })
//     blogName: string;

//     /**
//      * Title of the post
//      * @type {string}
//      * @required
//      */
//     @Prop({
//         type: String,
//         required: true,
//         maxlength: postConstraints.title.maxLength,
//     })
//     title: string;

//     /**
//      * Content of the post
//      * @type {string}
//      * @required
//      */
//     @Prop({
//         type: String,
//         required: true,
//         maxlength: postConstraints.content.maxLength,
//     })
//     content: string;

//     /**
//      * Short description of the post
//      * @type {string}
//      * @required
//      */
//     @Prop({
//         type: String,
//         required: true,
//         maxlength: postConstraints.shortDescription.maxLength,
//     })
//     shortDescription: string;

//     /**
//      * Creation timestamp
//      * Explicitly defined despite timestamps: true
//      * properties without @Prop for typescript so that they are in the class instance (or in instance methods)
//      * @type {String}
//      */
//     createdAt: string;
//     updatedAt: string;

//     /**
//      * Deletion timestamp, nullable, if date exist, means entity soft deleted
//      * @type {String | null}
//      */
//     @Prop({ type: String, nullable: true })
//     deletedAt: string | null;

//     /**
//      * Factory method to create a Post instance
//      * @param {CreateBlogPostDto} dto - The data transfer object for post creation
//      * @returns {MongoPostDocument} The created post document
//      */
//     static createInstance(dto: CreatePostDomainDto): MongoPostDocument {
//         const post = new this();

//         post.title = dto.title;
//         post.shortDescription = dto.shortDescription;
//         post.content = dto.content;
//         post.blogId = dto.blogId;
//         post.blogName = dto.blogName;

//         return post as MongoPostDocument;
//     }

//     /**
//      * Factory method to update a Post instance
//      * @param {UpdatePostDto} dto - The data transfer object for post creation
//      */
//     update(dto: UpdatePostDomainDto) {
//         if (dto.title) {
//             this.title = dto.title;
//         }
//         if (dto.shortDescription) {
//             this.shortDescription = dto.shortDescription;
//         }
//         if (dto.content) {
//             this.content = dto.content;
//         }
//     }

//     /**
//      * Marks the post as deleted
//      * Throws an error if already deleted
//      * @throws {Error} If the entity is already deleted
//      */
//     makeDeleted() {
//         if (this.deletedAt) {
//             throw NotFoundDomainException.create('Entity already deleted');
//         }
//         this.deletedAt = new Date().toISOString();
//     }
// }

// export const MongoPostSchema = SchemaFactory.createForClass(Post);

// MongoPostSchema.loadClass(Post);

// export type MongoPostDocument = HydratedDocument<Post>;

// export type MongoPostModelType = Model<MongoPostDocument> & typeof Post;
