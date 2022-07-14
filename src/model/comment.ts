import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Projet } from "./projet";
import { User } from "./user";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    // @Column()
    // userId:number

    @Column({type:"varchar"})
    body:string

    // @Column({ default: 'n/a' })
    // author?: string;

    // @Column({ default: 0 })
    // likes?: number;

    // @Column({ default: 0 })
    // dislikes?: number

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date

    @CreateDateColumn({ type: 'timestamp' })
    updatedDate: Date

    @ManyToOne(type => Projet, projet => projet.comments)
    projet: Projet

    @ManyToOne(() => User ,user =>user.comments ) 
    @JoinColumn({ name: 'user_id'})
    author: User;


}
