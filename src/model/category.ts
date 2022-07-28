import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Course } from "./course";
import { Projet } from "./projet";
import { Files } from "./files";

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

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}