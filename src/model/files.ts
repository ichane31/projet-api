import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Files extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({
        type: 'bytea'
    })
    content: Buffer
    @Column({default: false}) 
    isDefault: boolean
    @Column({default: null}) 
    original_name: string
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}