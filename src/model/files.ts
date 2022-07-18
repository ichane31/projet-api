import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Projet } from './projet';
 
@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  filename: string;
 
  @Column({
    type: 'bytea',
  })
  data: Uint8Array; 


//   @ManyToOne(
//     () => User,
//     (user: User) => user.files,
//     { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
//   )
//   @JoinColumn({ name: 'user_id' })
//   user: User;

  // @ManyToOne(
  //   () => Projet,
  //   (projet: Projet) => projet.files,
  //   { onUpdate: 'CASCADE', onDelete: 'SET NULL' },
  // )
  // @JoinColumn({ name: 'projet_id' })
  // projet: Projet;
}