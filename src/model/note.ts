import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Projet } from "./projet";
import { User } from "./user";
@Entity()
export class Note  extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    value: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToOne(() => Projet, projet => projet.id)
    projet: Projet;
    
    @ManyToOne(() => User)
    user: User;
}