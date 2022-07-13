import { Router } from "express";
import commentController from "../controller/comment.controller";

class CommentRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        // this.router.get('/', commentController.getCommentsByProjet);
        this.router.post('/', commentController.createComment);
        this.router.get('/:commentId', commentController.commentById);
        // this.router.put('/:commentId', commentController.updateLab);
        this.router.delete('/:commentId', commentController.deleteComment);
        this.router.get('/:projetId/list',commentController.getCommentsByProjet);
    }

}

export default new CommentRouter();