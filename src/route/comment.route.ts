import { Router } from "express";
import commentController from "../controller/comment.controller";

class CommentRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        
        this.router.post('/:projetId', commentController.createComment);
        this.router.get('/:commentId', commentController.commentById);
        this.router.put('/:commentId', commentController.updateComment);
        this.router.delete('/:commentId', commentController.deleteComment);
        this.router.get('/:projetId/list',commentController.getCommentsByProjet);
        this.router.get('/:projetId/count', commentController.countCommentByProjet);
        this.router.post('/:commentId', commentController.replyToComment);
        this.router.get('/:commentId/count', commentController.countReplyByComment);
    }

}

export default new CommentRouter();