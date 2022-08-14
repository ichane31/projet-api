import categoryService from './category.service'
import courseService from './course.service'
import chapterService from './chapter.service'
import { Injectable } from '@nestjs/common';
import { Category } from '../model/category';
import { Projet } from '../model/projet';
import projetService from './projet.service';

@Injectable()
export class SearchService {

    private matcher(query: string): RegExp {
        const input2matcher = '[\\w\\W]*' + query.replace(/[\W]+/g, '').split('').map(x => x + '[\\w\\W]*').join('');
        return new RegExp(input2matcher, 'gi');
    }
    public async getCategories(query: string): Promise<Category[]> {
        let searchRegExp = this.matcher(query);
        let allCategories = await categoryService.getAll();
        return allCategories.filter(x => searchRegExp.test(x.name) || searchRegExp.test(x.description));
    }

   
    public async getProjets(query: string): Promise<Projet[]> {
        let searchRegExp = this.matcher(query);
        let allProjets = await projetService.getAllProjet();
        return allProjets.filter(x => searchRegExp.test(x.title) || searchRegExp.test(x.description));
    }


}
export default new SearchService();