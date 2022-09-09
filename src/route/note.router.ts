import { Router } from "express";
import noteController from "../controller/note.controller";
import {ensureAuthenticated} from '../middleware/ensureAuthenticated.middleware';

class NoteRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.post('/:projetId', ensureAuthenticated, noteController.addNote);
        this.router.get('/:noteId', noteController.getNoteById);
        this.router.put('/:noteId',ensureAuthenticated, noteController.updateNote);
        this.router.delete('/:noteId',ensureAuthenticated, noteController.deleteNote);
        this.router.get('/:projetId/list',noteController.getNoteByProjet);
        this.router.get('/:projetId/count', noteController.getCountByProjet);
    }

}

export default new NoteRouter();