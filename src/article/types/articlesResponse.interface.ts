import { Article } from '../article.entity';
import { ArticleType } from './article.type';

export interface IArticlesResponse {
  articles: ArticleType[];
  articlesCount: number;
}
