import { Router } from "express";
import contactController from "../controller/contact.controller";


class ContactRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.post('/', contactController.createContact);
        this.router.get('/', contactController.allContacts);
        this.router.delete('/:contactId', contactController.deleteContact);
    }

}

export default new ContactRouter();