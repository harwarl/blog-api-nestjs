import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  UseGuards,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { CreateArticleDto } from './dto';
import { UserD } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/user.entity';
import { IArticleResponse } from './types/articleResponse.interface';
import { DeleteResult } from 'typeorm';
import { UpdateArticleDto } from './dto/updateArticleDto';
import { IArticlesResponse } from './types/articlesResponse.interface';
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  async getAll(
    @UserD('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IArticlesResponse> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @UserD() currentUser: User,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    return this.articleService.createArticle(currentUser, createArticleDto);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @UserD('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IArticlesResponse> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    return this.articleService.findBySlug(slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @UserD('id') currentUserId: number,
    @Body('article') updateArticleDto: UpdateArticleDto,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    return this.articleService.updateArticle(
      slug,
      updateArticleDto,
      currentUserId,
    );
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @UserD('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return this.articleService.deleteArticle(currentUserId, slug);
  }

  @Post(':slug/favourite')
  @UseGuards(AuthGuard)
  async likeArticle(
    @UserD('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    return await this.articleService.likeArticle(currentUserId, slug);
  }

  @Delete(':slug/favourite')
  @UseGuards(AuthGuard)
  async unlikeArticle(
    @UserD('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    return await this.articleService.dislikeArticle(currentUserId, slug);
  }
}
