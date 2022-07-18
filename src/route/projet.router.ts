import { Router } from "express";
import projetController from "../controller/projet.controller";

class ProjetRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get('/', projetController.getProjets);
        this.router.post('/', projetController.createProjet);
        this.router.get('/:projetId', projetController.projetById);
        this.router.put('/:projetId', projetController.updateProjet);
        this.router.delete('/:projetId', projetController.deleteProjet);
        this.router.get('/count', projetController.getCount);
        this.router.get('category/:categoryId/count', projetController.getCountByCategory);
        this.router.get('user/:userId/count', projetController.getCountByUser);
        this.router.get('/:userId/list', projetController.allProjetsByUser);
    }

}

export default new ProjetRouter();