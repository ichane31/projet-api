import { Expose } from "class-transformer";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationCount } from "typeorm";
import slugify from 'slug';
import { Category } from "./category";
import { Comment } from "./comment";
import { Note } from "./note";
import { User } from "./user";
import { Files } from "./files";


@Entity()
export class Projet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    title: string

    @Column()
    description:string
    
    @Column({ nullable: true})
    image: string

    @Column({ nullable: true})
    resume:string

    @Column({ nullable: true})
    rapport:string

    @Column({ nullable: true})
    presentation:string

    @Column({ nullable: true})
    videoDemo: string

    @Column({ nullable: true})
    codeSource:string

    @Column()
    prix:number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @CreateDateColumn({ type: 'timestamp' })
    updatedAt: Date

    @BeforeUpdate()
    updateTimestamp() {
      this.updatedAt = new Date();
    }

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

    @OneToMany(() => Note, (note) => note.projet)
    notes: Note[];

    // @OneToMany(() => File ,file =>file.projet )
    // files: File;

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