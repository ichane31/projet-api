import { Router } from "express";
import noteController from "../controller/note.controller";

class NoteRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.post('/:projetId', noteController.addNote);
        this.router.get('/:noteId', noteController.getNoteById);
        this.router.put('/:noteId', noteController.updateNote);
        this.router.delete('/:noteId', noteController.deleteNote);
        this.router.get('/:projetId/Notelist',noteController.getNoteByProjet);
    }

}

export default new NoteRouter();