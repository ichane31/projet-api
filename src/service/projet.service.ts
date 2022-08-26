import { Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Projet } from '../model/projet';
import { User} from '../model/user';
import { Category } from '../model/category';
import userService from './user.service';

@Injectable()
export class ProjetService {

    private projetRepository: Repository<Projet>;

    constructor() {
        this.projetRepository = PostgresDataSource.getRepository(Projet);
    }

   async getCount(count : number): Promise<Projet[]> {
      return this.projetRepository.find({relations:['category','author','comments','notes'] ,
     order :{'createdAt' :'DESC'} , take : count});
      }

    async count(): Promise<number> {
      const count = await this.projetRepository.count();
      return count
    }

    public async update(projetId: number, projet: Projet) {
        
        return this.projetRepository.save({ ...projet, id: projetId });
    }
    public async getAllProjet(page = 1, take = 20): Promise<Projet[]> {
        return this.projetRepository.find({
            relations: ['category','author','comments','notes'],
            skip: take * (page - 1),
            take,
            order:{createdAt: 'DESC'}
        });
    }

    async getProjetsCountByUser(authorId: number): Promise<number> {
        const ProjetsCountUser = await this.projetRepository
          .createQueryBuilder()
          .leftJoinAndSelect("Projet.author", "User")
          .where("Category.id = :categoryId", { authorId })
          .getCount();
        return ProjetsCountUser;
      }

    async getProjetsCountByCategory(categoryId: number ): Promise<number> {
      return await this.projetRepository.createQueryBuilder()
          .leftJoinAndSelect("Projet.category", "Category")
          .where("Category.id = :categoryId", { categoryId })
          .getCount();
        
      }

    public async getById(id: number): Promise<Projet | null> {
        return this.projetRepository.findOne({ where: { id }, 
        relations:['category','author','comments','notes']},
            );
    }

    public async getProjetByTitle(
        title: string,
    ): Promise<Projet[]> {
        return this.projetRepository.find({where:{title}})
    }

    public ensureOwnership(user: User, projet: Projet): boolean {
        return projet.author.id === user.id;
      }

    public async createProj(projet: Projet /*, userEmail:string*/): Promise<Projet> {
           
        return this.projetRepository.save(projet);
        
    }
    

    public async deleteProjetById(id: number/*, user: User*/): Promise<{ message: string }> {
        const projet = await this.projetRepository.delete({ id/*,user.id*/ })

        if (projet.affected === 0) {
            throw new NotFoundException(`This ${id} is not found`)
        }
        return { message: 'Deleted successfully !' }
    }
    
    public async getByCategory(categoryId: number , page = 1, take = 25): Promise<Projet[]> {
        return this.projetRepository.createQueryBuilder()
            .leftJoinAndSelect("Projet.category", "Category")
            .leftJoinAndSelect('Projet.comments','Comment')
            .leftJoinAndSelect("Projet.notes","Note")
            .leftJoinAndSelect("Projet.author","User")
            .where("Category.id = :categoryId", { categoryId })
            .skip((page - 1) * take)
            .take(take)
            .orderBy('Projet.createdAt','DESC')
            .getMany();
    }

    public async getProjetByUser(userId: number , page = 1, take = 25): Promise<Projet[]> {
        return this.projetRepository.createQueryBuilder()
            .innerJoinAndSelect("Projet.user", "User")
            .leftJoinAndSelect('Projet.comments','Comment')
            .leftJoinAndSelect('Projet.notes','Note')
            .leftJoinAndSelect('Projet.category','Category')
            .where("User.id = :userId", { userId })
            .orderBy('createdAt','DESC')
            .getMany();
    }

    public async favoriteProjet(
        id: number,
        user: User,
      ): Promise<Projet> {
        const projet = await this.getById(id);
        projet.favoritedBy.push(user);
        user.favorites.push(projet);
        this.update(id, projet);
        return (await this.getById(id) );
      }

    public async unfavoriteProjet(
        id: number,
        user: User,
      ): Promise<Projet> {
        const projet = await this.getById(id);
        projet.favoritedBy = projet.favoritedBy.filter(fav => fav.id !== user.id);
        user.favorites = user.favorites.filter(favorite => favorite.id !== projet.id);
        this.update(id ,projet);
        return (await this.getById(id));
      }

}

export default new ProjetService();