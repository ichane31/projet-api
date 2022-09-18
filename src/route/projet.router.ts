import { Router } from "express";
import projetController from "../controller/projet.controller";
import { ensureAuthenticated} from '../middleware/ensureAuthenticated.middleware';

class ProjetRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get('/', projetController.getProjets);
        this.router.post('/', ensureAuthenticated,projetController.createProjet);
        this.router.get('/latest/:count', projetController.getlatestProjets);
        this.router.get('/suggestions/:count' , ensureAuthenticated , projetController.getSuggestions);
        this.router.get('/:projetId', projetController.projetById);
        this.router.put('/:projetId',ensureAuthenticated, projetController.updateProjet);
        this.router.delete('/:projetId',ensureAuthenticated, projetController.deleteProjet);
        this.router.get('/count', projetController.Count);
        this.router.get('/:categoryId/count', projetController.getCountByCategory);
        this.router.get('/:userId/count', projetController.getCountByUser);
        this.router.get('/user/Projetlist',ensureAuthenticated, projetController.allProjetsByUser);
        this.router.get('/favorites/:count' , ensureAuthenticated , projetController.getFavoriteProjets);
        this.router.get('/user/favorites', ensureAuthenticated , projetController.getAllFavoriteProjets)
        this.router.post('/:projetId/favorite' , ensureAuthenticated , projetController.favoriteProjet);
        this.router.delete('/:projetId/unfavorite' , ensureAuthenticated , projetController.unfavoriteProjet)
    }

}

export default new ProjetRouter();