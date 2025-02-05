import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { CreatePostDto } from '../dto/create/create-post.dto';
import { PostsRepository } from '../infrastructure/repositories/posts.repository';
import { UpdatePostDto } from '../dto/update/update-post.dto';
import { BlogsRepository } from '../infrastructure/repositories/blogs.repository';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
    ) {}

    async createPost(dto: CreatePostDto): Promise<string> {
        const blog =
            await this.blogsRepository.findByIdNonDeletedOrNotFoundFail(
                dto.blogId,
            );

        const post = this.PostModel.createInstance({
            ...dto,
            blogName: blog.name,
        });

        await this.postsRepository.save(post);

        return post._id.toString();
    }

    async updatePost(id: string, dto: UpdatePostDto): Promise<void> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(id);

        post.update(dto);
        await this.postsRepository.save(post);
    }

    //TODO: implement update like status

    async deletePost(id: string): Promise<void> {
        const post =
            await this.postsRepository.findByIdNonDeletedOrNotFoundFail(id);

        post.makeDeleted();

        await this.postsRepository.save(post);
    }
}
