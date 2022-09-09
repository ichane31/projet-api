import { Router } from "express";
import contactController from "../controller/contact.controller";
import {ensureAuthenticated} from '../middleware/ensureAuthenticated.middleware';

class NoteRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.post('/', ensureAuthenticated, contactController.createContact);
        this.router.get('/', contactController.allContacts);
        this.router.delete('/:contactId',ensureAuthenticated, contactController.deleteContact);
        this.router.get('/listQuestion', ensureAuthenticated ,contactController.getContactByUser);
    }

}

export default new NoteRouter();