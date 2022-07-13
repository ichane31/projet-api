import { Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Projet } from '../model/projet';
import { User } from '../model/user';
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
            relations: ['category','author','comments'],
            skip: take * (page - 1),
            take,
            order:{createdAt: 'DESC'}
        });
    }

    async getProjetsCountByUser(user: User): Promise<number> {
        const ProjetsCountUser = await this.projetRepository
          .createQueryBuilder('projet')
          .innerJoin('projet.author', 'author', 'user.id = :userId', { userId: user.id })
          .getCount();
        return ProjetsCountUser;
      }

    async getProjetsCountByCategory(category: Category ): Promise<number> {
        const ProjetsCount = await this.projetRepository
          .createQueryBuilder('projet')
          .innerJoin('projet.category', 'category', 'category.id = :catId', { catId: category.id })
          .getCount();
        return ProjetsCount;
      }

    public async getById(id: number): Promise<Projet | null> {
        return this.projetRepository.findOne({ where: { id }, 
        relations:['category','author','comments']},
            );
    }

    async getProjetByTitle(
        title: string,
    ): Promise<Projet[]> {
        return this.projetRepository.find({where:{title}})
    }


    public async createProj(projet: Projet , userEmail:string): Promise<Projet> {
        // const {title, description,resume,rapport,image,presentation,videoDemo,codeSource,prix} = projet
        //     const proj = new Projet()
        //     proj.title = title
        //     proj.description = description
        //     proj.resume = resume
        //     proj.rapport = rapport
        //     proj.image = image
        //     proj.presentation = presentation
        //     proj.videoDemo = videoDemo
        //     proj.codeSource = codeSource
        //     proj.prix = prix
        //     proj.author = user
        let $author = await userService.getByEmail(userEmail)
        projet.author = $author
           
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
            .leftJoin("Projet.category", "Category")
            .leftJoinAndSelect('Projet.comments','Comment','Comment.projet = Projet.id')
            .where("Category.id = :categoryId", { categoryId })
            .skip((page - 1) * take)
            .take(take)
            .orderBy('Projet.createdAt','DESC')
            .getMany();
    }

    public async getProjetByUser(userId: number , page = 1, take = 25): Promise<Projet[]> {
        return this.projetRepository.createQueryBuilder()
            .innerJoin("Projet.user", "User")
            // .leftJoinAndSelect('Projet.comments','Comment')
            .leftJoinAndSelect('Projet.category','Category')
            .where("User.id = :userId", { userId })
            .orderBy('createdAt','DESC')
            .getMany();
    }

    

}

export default new ProjetService();