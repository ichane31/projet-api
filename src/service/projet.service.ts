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

    getCount(): Promise<number> {
        return this.projetRepository.count({});
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

    async getProjetsCountByUser(author: User): Promise<number> {
        const ProjetsCountUser = await this.projetRepository
          .createQueryBuilder()
          .innerJoin('Projet.author', 'author', 'author.id = :userId', { userId: author.id })
          .getCount();
        return ProjetsCountUser;
      }

    async getProjetsCountByCategory(category: Category ): Promise<number> {
        const ProjetsCount = await this.projetRepository
          .createQueryBuilder('projet')
          .innerJoin('Projet.category', 'category', 'category.id = :catId', { catId: category.id })
          .getCount();
        return ProjetsCount;
      }

    public async getById(id: number): Promise<Projet | null> {
        return this.projetRepository.findOne({ where: { id }, 
        relations:['category','author','comments','notes']},
            );
    }

    async getProjetByTitle(
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

    async favoriteProjet(
        id: number,
        user: User,
      ): Promise<Projet> {
        const projet = await this.getById(id);
        projet.favoritedBy.push(user);
        await projet.save();
        return (await this.getById(id) );
      }

      async unfavoriteProjet(
        id: number,
        user: User,
      ): Promise<Projet> {
        const projet = await this.getById(id);
        projet.favoritedBy = projet.favoritedBy.filter(fav => fav.id !== user.id);
        await projet.save();
        return (await this.getById(id));
      }

}

export default new ProjetService();