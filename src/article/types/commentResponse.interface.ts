import { Article } from '../article.entity';

export interface ICommentResponse {
  article: Article;
  comment: string;
}
