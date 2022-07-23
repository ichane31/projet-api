import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationCount } from "typeorm";
import { Likes } from "./likes";
import { Projet } from "./projet";
import { User } from "./user";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:"varchar"})
    body:string

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date

    @CreateDateColumn({ type: 'timestamp' })
    updatedDate: Date

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

    // @OneToMany(() => Likes,)
    // likes: Likes[];
    
    // @RelationCount((comment: Comment) => comment.likes)
    // likesCount: number;

}
