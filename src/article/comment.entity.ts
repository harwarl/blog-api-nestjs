import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articleSlug: string;

  @Column()
  commenterId: number;

  @Column()
  comment: string;
}
