import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Course } from "./course";
import { Projet } from "./projet";
@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column({
        length: 255,
        default: ""
    })
    description: string
    @Column({
        nullable: true
    })
    image: string
    @OneToMany(
        () => Course,
        course => course.category
    )
    courses: Course[]

    @OneToMany(
        () => Projet,
        projet => projet.category
    )
    projets: Projet[]
}