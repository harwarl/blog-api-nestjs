import { ArticleType } from './article.type';

export type CommentType = ArticleType & { comment: string };
