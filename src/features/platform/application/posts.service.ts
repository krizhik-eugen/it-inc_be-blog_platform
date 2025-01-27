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
        const blog = await this.blogsRepository.findNonDeletedOrNotFoundFail(
            dto.blogId,
        );

        const post = this.PostModel.createInstance({
            ...dto,
            blogName: blog.name,
        });

        await this.postsRepository.save(post);

        return post._id.toString();
    }

    async updatePost(id: string, dto: UpdatePostDto) {
        const post =
            await this.postsRepository.findNonDeletedOrNotFoundFail(id);

        post.update(dto);
        return await this.postsRepository.save(post);
    }

    //TODO: implement update like status

    async deletePost(id: string) {
        const post =
            await this.postsRepository.findNonDeletedOrNotFoundFail(id);

        post.makeDeleted();

        return await this.postsRepository.save(post);
    }
}
