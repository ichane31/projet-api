import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToMany } from "typeorm";
import { Role } from '../types/role.enum';
import { Lab } from "./lab";
import { Projet } from "./projet";
import { Comment } from "./comment";
import { Note } from "./note";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    firstname: string
    @Column()
    lastname: string
    @Column()
    email: string
    @Column()
    password: string
    @Column()
    image: string
	@Column({
		type: 'enum',
        enum: Role,
        default: Role.USER
	})
    role: Role
    @Column({
        nullable: true
    })
    active: Date
    @Column({
        default: false
    })
    MFA: boolean
    @OneToMany(
        () => Lab,
        lab => lab.user
    )
    labs: Lab[]

    @OneToMany(
        () => Projet,
        projet => projet.author
    )
    projets: Projet[]

    @OneToMany(() => Note, (note) => note.user)
    notes: Note[];

    @OneToMany(
        () => Comment,
        comment => comment.author
    )
    comments: Comment[]


    @ManyToMany(
        type => Projet,
        projet => projet.favoritedBy,
      )
      favorites: Projet[];


}