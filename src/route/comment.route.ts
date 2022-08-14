import { Router } from "express";
import commentController from "../controller/comment.controller";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.middleware";

class CommentRouter {
    public router: Router; 

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        
        this.router.get('/', commentController.getAllComments);
        this.router.post('/:projetId', commentController.createComment);
        this.router.get('/:commentId', commentController.commentById);
        this.router.put('/:commentId', commentController.updateComment);
        this.router.delete('/:commentId', commentController.deleteComment);
        this.router.get('/:projetId/list',commentController.getCommentsByProjet);
        this.router.get('/:parentId/Replieslist',commentController.getRepliesByComment);
        this.router.get('/:projetId/count', commentController.countCommentByProjet);
        this.router.post('/:commentId/reply', commentController.replyToComment);
        this.router.post('/:commentId/like', ensureAuthenticated, commentController.addCommentToLikes);
        this.router.delete('/:commentId/dislike', ensureAuthenticated, commentController.removeCommentFromLikes);
    
    }

}

export default new CommentRouter();