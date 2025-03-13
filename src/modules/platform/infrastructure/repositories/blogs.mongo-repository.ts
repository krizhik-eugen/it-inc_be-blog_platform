import { InjectModel } from '@nestjs/mongoose';
import {
    MongoBlog,
    MongoBlogDocument,
    MongoBlogModelType,
} from '../../domain/blog.entity';
import { NotFoundDomainException } from '../../../../core/exceptions';

export class MongoBlogsRepository {
    constructor(
        @InjectModel(MongoBlog.name) private BlogModel: MongoBlogModelType,
    ) {}

    async save(blog: MongoBlogDocument) {
        return blog.save();
    }

    async findById(id: string): Promise<MongoBlogDocument | null> {
        return this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async findByIdOrNotFoundFail(id: string): Promise<MongoBlogDocument> {
        const blog = await this.findById(id);

        if (!blog) {
            throw NotFoundDomainException.create('MongoBlog not found');
        }

        return blog;
    }

    async findByIdNonDeletedOrNotFoundFail(
        id: string,
    ): Promise<MongoBlogDocument> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!blog) {
            throw NotFoundDomainException.create('MongoBlog not found');
        }
        return blog;
    }
}
