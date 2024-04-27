import { Article } from '../article.entity';

export interface IArticlesResponse {
  articles: Article[];
  articlesCount: number;
}
