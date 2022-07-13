import { Expose } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationCount } from "typeorm";
import { Category } from "./category";
import { Comment } from "./comment";
import { User } from "./user";

@Entity()
export class Projet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    // @Column()
    // userId: number

    @Column({ type: "varchar"})
    title: string

    @Column()
    description:string

    @Column()
    resume:string

    @Column()
    rapport:string

    @Column()
    image: string

    @Column()
    presentation:string

    @Column()
    videoDemo: string

    @Column()
    codeSource:string

    @Column()
    prix:number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @CreateDateColumn({ type: 'timestamp' })
    updatedAt: Date

    @ManyToOne(
        () => Category,
        category => category.courses
    )
    @JoinColumn({
        name: 'category_id'
    })
    category: Category

    @OneToMany(
        () => Comment,
        comment => comment.projet
    )
    comments: Comment[]

    @ManyToOne(
        () => User,
        user => user.projets
    )
    @JoinColumn({
        name: 'user_id'
    })
    author: User

    @ManyToMany(
        type => User,
        user => user.favorites,
        { eager: true },
      )
      @JoinTable()
      favoritedBy: User[];
    
      @RelationCount((projet: Projet) => projet.favoritedBy)
      favoritesCount: number;
    
      @Expose() get commentCount(): number {
        return this.comments?.length;
      }

    
}