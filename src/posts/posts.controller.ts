import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PostsService } from './posts.service';
import Posts from './posts.entity';
import { PostDataDto } from './dto/post-data.dto';
import { PostIdDto } from './dto/post-id.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PostPageDto } from './dto/post-page.dto';
import { CommentDataDto } from './dto/comment-data.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAll(
    @Res() res: Response,
    @Query() page: PostPageDto,
  ): Promise<Response> {
    const posts = await this.postsService.getAll(page);
    if (posts.posts.length > 0) {
      return res.status(HttpStatus.OK).send(posts);
    }
    return res.status(HttpStatus.NOT_FOUND).send({
      posts: [],
      message: [`Can\`t get posts on page ${page.page || 0}`],
    });
  }

  @Post()
  async create(
    @Body() postsData: PostDataDto,
    @Req() req: Request,
  ): Promise<Posts> {
    postsData.userId = req.user.id;
    return this.postsService.create(postsData);
  }

  @Put('like/:id')
  async like(@Param() postId: PostIdDto, @Req() req: Request): Promise<Posts> {
    return this.postsService.like(postId, req.user);
  }

  @Delete('like/:id')
  async unLike(
    @Param() postId: PostIdDto,
    @Req() req: Request,
  ): Promise<Posts> {
    return this.postsService.unLike(postId, req.user);
  }

  @Post('comment/:id')
  async comment(
    @Body() commendData: CommentDataDto,
    @Param() postId: PostIdDto,
    @Req() req: Request,
  ): Promise<Posts> {
    return this.postsService.comment(postId, commendData);
  }
}
