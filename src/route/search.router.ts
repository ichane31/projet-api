import { Router } from "express";
import searchController from "../controller/search.controller";

class SearchRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.post('/', searchController.getResults);
        this.router.get('/', searchController.getResultsQ);
        this.router.post('/category', searchController.getCategories);
        this.router.get('/category', searchController.getCategoriesQ);
        this.router.post('/projet', searchController.getProjets);
        this.router.get('/projet', searchController.getProjetsQ);
    }

}

export default new SearchRouter();