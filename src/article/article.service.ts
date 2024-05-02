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
import { Follow } from 'src/profile/follow.entity';
import { Comment } from './comment.entity';
import { ICommentResponse } from './types/commentResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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

    if (query.favourited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favourited },
        relations: ['favourites'],
      });
      const ids = author.favourites.map((el) => el.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids }); //there is a bug for when ids is an empty list
      } else {
        queryBuilder.andWhere('1=0'); //this line is always false
      }
    }
    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favouriteIds: number[] = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favourites'],
      });
      favouriteIds = currentUser.favourites.map((favourite) => favourite.id);
    }
    const articles = await queryBuilder.getMany();
    const articlesWithFavourited = articles.map((article) => {
      const favourited = favouriteIds.includes(article.id);
      return { ...article, favourited };
    });

    return {
      articles: articlesWithFavourited,
      articlesCount,
    };
  }

  async getFeed(currentUserId: number, query: any): Promise<IArticlesResponse> {
    const follows = await this.followRepository.find({
      where: {
        followerId: currentUserId,
      },
    });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserIds = follows.map((follow) => follow.followingId);
    const queryBuilder = this.dataSource
      .getRepository(Article)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

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

  async commentArticle(
    currentUserId: number,
    slug: string,
    comment: string,
  ): Promise<ICommentResponse> {
    const article = await this.articleRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    const commentExists = await this.commentRepository.findOne({
      where: {
        articleSlug: slug,
        commenterId: currentUserId,
      },
    });

    if (!commentExists) {
      const commentOnArticle = new Comment();
      commentOnArticle.articleSlug = article.slug;
      commentOnArticle.commenterId = currentUserId;
      commentOnArticle.comment = comment;
      await this.commentRepository.save(commentOnArticle);
    } else {
      commentExists['comment'] = comment;
      await this.commentRepository.save(commentExists);
    }

    return {
      article,
      comment: commentExists.comment,
    };
  }

  async uncommentArticle(
    currentUserId: number,
    slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    const commentExists = await this.commentRepository.findOne({
      where: {
        articleSlug: slug,
        commenterId: currentUserId,
      },
    });

    await this.commentRepository.delete(commentExists.id);

    return {
      article,
    };
  }
}
