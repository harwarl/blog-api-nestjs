import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import {
  DataSource,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { User } from 'src/user/user.entity';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { IArticlesResponse } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  private buildArticleResponse(article: Article): IArticleResponse {
    return { article };
  }

  async findAll(currentUserId: number, query: any): Promise<IArticlesResponse> {
    // const queryBuilder: SelectQueryBuilder<Article> =
    //   this.articleRepository.createQueryBuilder('articles');

    // const found = await queryBuilder.where(query);
    const queryBuilder = this.dataSource
      .getRepository(Article)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'article');
    if (query.tag) {
      queryBuilder.where('articles.tagList LIKE :tag', {
        tag: `%${query.tag}`,
      });
    }
    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }
    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();
    return {
      articles,
      articlesCount,
    };
  }

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

  async likeArticle(
    currentUserId: number,
    slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.findArticleBySlug(slug);
    if (!article)
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favourites'],
    });
    //check if user liked the article already
    const isNotFavourited =
      user.favourites.findIndex(
        (articleInfav) => articleInfav.id === article.id,
      ) === -1;

    if (isNotFavourited) {
      user.favourites.push(article);
      article.favouritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return this.buildArticleResponse(article);
  }

  async dislikeArticle(
    currentUserId: number,
    slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.findArticleBySlug(slug);
    if (!article)
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favourites'],
    });
    //check if user liked the article already
    const articleIndex = user.favourites.findIndex(
      (articleInfav) => articleInfav.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favourites.splice(articleIndex, 1);
      article.favouritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return this.buildArticleResponse(article);
  }
}
