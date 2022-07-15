import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { Comment } from './comment';
  
  @Entity('Reply')
  export class Reply {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @Column({ length: 256 })
    body: string;
  
    @ManyToOne(type => Comment, comment => comment.replies)
    comment: Comment;
  }