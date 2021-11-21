import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Posts from './posts.entity';
import { Repository } from 'typeorm';
import { PostDataDto } from './dto/post-data.dto';
import { PostIdDto } from './dto/post-id.dto';
import { Users } from '../users/users.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  async getAll(page?: number): Promise<{ posts: Posts[]; total: number }> {
    if (page < 1) page = 1;
    const take = 10;
    const skip = (page - 1) * take;
    const [result, total] = await this.postsRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.comments', 'comments')
      .leftJoin('posts.user', 'user')
      .leftJoin('posts.likes', 'likes')
      .leftJoin('comments.replies', 'replies')
      .leftJoin('comments.user', 'commentUser')
      .leftJoin('replies.user', 'replyUser')
      .where('comments.commentsId IS NULL')
      .take(take)
      .skip(skip || 0)
      .select([
        'posts',
        'likes',
        'comments.id',
        'comments.content',
        'replies.id',
        'replies.content',
        'replyUser',
        'commentUser',
        'user',
      ])
      .orderBy('posts.createdDate', 'DESC')
      .getManyAndCount();

    return {
      posts: result,
      total,
    };
  }

  async create(postData: PostDataDto): Promise<Posts> {
    const post = await this.postsRepository.create(postData);
    await this.postsRepository.save(post);
    return this.postsRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id: post.id })
      .leftJoin('post.user', 'user')
      .leftJoin('post.comments', 'comments')
      .leftJoin('post.likes', 'likes')
      .select(['post', 'user', 'comments', 'likes'])
      .getOne();
  }

  async like(postId: string, userId: Users): Promise<Posts> {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
      relations: ['likes'],
    });
    post.likes.push(userId);
    return this.postsRepository.save(post);
  }

  async getById(postId: string): Promise<Posts | undefined> {
    return this.postsRepository.findOneOrFail({
      where: {
        id: postId,
      },
      relations: ['user', 'likes'],
    });
  }

  async unLike(postId: string, userId: Users): Promise<Posts> {
    const post = await this.postsRepository.findOne(postId, {
      relations: ['likes'],
    });
    post.likes = post.likes.filter((user) => user.id !== userId.id);
    return this.postsRepository.save(post);
  }
}
