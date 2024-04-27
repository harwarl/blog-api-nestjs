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
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { CreateArticleDto } from './dto';
import { UserD } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/user.entity';
import { IArticleResponse } from './types/articleResponse.interface';
import { DeleteResult } from 'typeorm';
import { UpdateArticleDto } from './dto/updateArticleDto';
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @UserD() currentUser: User,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    return this.articleService.createArticle(currentUser, createArticleDto);
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
}
