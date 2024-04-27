import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { User } from 'src/user/user.entity';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { title } from 'process';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async createArticle(
    currentUser: User,
    createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const newArticle = new Article();
    Object.assign(newArticle, createArticleDto);
    if (!newArticle.tagList) {
      newArticle.tagList = [];
    }

    newArticle.slug = this.getSlug(createArticleDto.title);
    newArticle.author = currentUser;
    const article = await this.articleRepository.save(newArticle);
    return this.buildArticleResponse(article);
  }

  buildArticleResponse(article: Article): IArticleResponse {
    return { article };
  }

  private async findArticleBySlug(slug: string): Promise<Article> {
    return await this.articleRepository.findOne({
      where: {
        slug: slug,
      },
    });
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      (Math.random() * (Math.pow(36, 6) | 0)).toString(36)
    );
  }

  async findBySlug(slug: string): Promise<IArticleResponse> {
    const article = await this.findArticleBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    return this.buildArticleResponse(article);
  }

  async deleteArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findArticleBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId)
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);

    return await this.articleRepository.delete({ slug: slug });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    currentUserId: number,
  ): Promise<IArticleResponse> {
    const article = await this.findArticleBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId)
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);

    Object.assign(article, updateArticleDto);
    article.slug = this.getSlug(updateArticleDto.title);
    const updatedArticle = await this.articleRepository.save(article);
    return this.buildArticleResponse(updatedArticle);
  }
}
