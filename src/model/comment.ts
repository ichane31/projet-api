import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn,Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationCount ,ManyToMany ,JoinTable } from "typeorm";
import { Projet } from "./projet";
import { User } from "./user";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:"varchar"})
    body:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date

    @ManyToOne(type => Projet, projet => projet.comments)
    projet: Projet

    @ManyToOne(() => User ,user =>user.comments ) 
    @JoinColumn({ name: 'user_id'})
    author: User;

    @ManyToOne(() => Comment ,parent =>parent.replies ,{
        onDelete: 'SET NULL'
    }) 
    commentParent: Comment;

    @OneToMany(()=> Comment , comment => comment.commentParent)
    replies: Comment[]

    @ManyToMany(
        type => User,
        user => user.likes,
        { eager: true },
      )
      @JoinTable({
        name: 'likes',
        inverseJoinColumn: {name: 'user' , referencedColumnName: 'id'},
        joinColumn: {name: 'comment' , referencedColumnName: 'id'}
      })
      likedBy: User[];
    
      @RelationCount((comment: Comment) => comment.likedBy)
      likesCount: number;

    

}
