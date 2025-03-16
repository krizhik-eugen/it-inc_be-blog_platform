// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Model } from 'mongoose';
// import { NotFoundDomainException } from '../../../core/exceptions';
// import { CreateBlogDomainDto } from './dto/create';
// import { UpdateBlogDomainDto } from './dto/update';

export const blogConstraints = {
    name: {
        maxLength: 15,
    },
    description: {
        maxLength: 500,
    },
    websiteUrl: {
        pattern:
            /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
        errorMessagePattern: 'Website URL should be a valid URL',
        maxLength: 100,
    },
};

// /**
//  * MongoBlog Entity Schema
//  * This class represents the schema and behavior of a MongoBlog entity.
//  */
// @Schema({ timestamps: true })
// export class MongoBlog {
//     /**
//      * Name of the blog
//      * @type {string}
//      * @required
//      */
//     @Prop({
//         type: String,
//         required: true,
//         maxlength: blogConstraints.name.maxLength,
//     })
//     name: string;

//     /**
//      * Description of the blog
//      * @type {string}
//      * @required
//      */
//     @Prop({
//         type: String,
//         required: true,
//         maxlength: blogConstraints.description.maxLength,
//     })
//     description: string;

//     /**
//      * Website Url of the blog
//      * @type {string}
//      * @required
//      */
//     @Prop({
//         type: String,
//         required: true,
//         maxlength: blogConstraints.websiteUrl.maxLength,
//         validate: {
//             validator: (value: string) =>
//                 blogConstraints.websiteUrl.pattern.test(value),
//             message: blogConstraints.websiteUrl.errorMessagePattern,
//         },
//     })
//     websiteUrl: string;

//     @Prop({ type: Boolean, default: false })
//     isMembership: boolean;

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
//      * Factory method to create a MongoBlog instance
//      * @param {CreateBlogDto} dto - The data transfer object for blog creation
//      * @returns {MongoBlogDocument} The created blog document
//      */
//     static createInstance(dto: CreateBlogDomainDto): MongoBlogDocument {
//         const blog = new this();

//         blog.name = dto.name;
//         blog.description = dto.description;
//         blog.websiteUrl = dto.websiteUrl;

//         return blog as MongoBlogDocument;
//     }

//     /**
//      * Factory method to update a MongoBlog instance
//      * @param {UpdateBlogDto} dto - The data transfer object for blog creation
//      */
//     update(dto: UpdateBlogDomainDto) {
//         if (dto.name) {
//             this.name = dto.name;
//         }
//         if (dto.description) {
//             this.description = dto.description;
//         }
//         if (dto.websiteUrl) {
//             this.websiteUrl = dto.websiteUrl;
//         }
//     }

//     /**
//      * Marks the blog as deleted
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

// export const MongoBlogSchema = SchemaFactory.createForClass(MongoBlog);

// MongoBlogSchema.loadClass(MongoBlog);

// export type MongoBlogDocument = HydratedDocument<MongoBlog>;

// export type MongoBlogModelType = Model<MongoBlogDocument> & typeof MongoBlog;
