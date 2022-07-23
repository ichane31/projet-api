import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Comment } from '../model/comment';
import {  Injectable, NotFoundException } from '@nestjs/common';
import  projetService from './projet.service';
import userService from './user.service';
import { User } from '../model/user';
// import  likesService  from './likes.service';

@Injectable()
export class CommentService {

    private commentRepository: Repository<Comment>;

    constructor() {
        this.commentRepository = PostgresDataSource.getRepository(Comment);
    }

    public async getComments(projetId: number, page = 1): Promise<Comment[]> {
        return this.commentRepository.createQueryBuilder()
            .leftJoinAndSelect("Comment.projet", "Projet")
            .leftJoinAndSelect("Comment.author" , "User.firstname")
            .where("Projet.id = :projetId", { projetId })
            .take(25)
            .skip((page - 1) * 25)
            .getMany();
    }

    public async getReplies(parentId: number, page = 1): Promise<Comment[]> {
        return this.commentRepository.createQueryBuilder()
            .leftJoin("Comment.commentParent", "Comment")
            .leftJoinAndSelect("Comment.author" , "User.firstname")
            .where("Comment.id = :parentId", { parentId })
            .take(25)
            .skip((page - 1) * 25)
            .getMany();
    }

    // async getAllComments(projetId: number, page: number, take: number): Promise<Comment[]> {
    //     const projet = await projetService.getById(projetId);
    //     if (projet) {
    //       return projet.comments;
    //     }
    //   }

    public async createComment(comment: Comment ): Promise<Comment> { 
        const createdComment =  this.commentRepository.save(comment);
        return this.getById((await createdComment).id)
        
    }
    
    public async getById(id: number): Promise<Comment | null> {
        return this.commentRepository.findOne( { where: { id }, 
            relations:['projet','author','commentParent','replies']},
            );
    }

    public async updateComment(commentId: number, comment: Comment) {
        return this.commentRepository.save({ ...comment, id: commentId });
    }

    public async deleteCommentById(id: number/*, user: User*/): Promise<{ message: string }> {
        const comment = await this.commentRepository.delete(id/*,user.id*/ )

        if (comment.affected === 0) {
            throw new NotFoundException(`This ${id} is not found`)
        }
        return { message: 'Deleted successfully !' }
    }

    public async createReply(reply: Comment ): Promise<Comment> { 
        const createdReply =  this.commentRepository.save(reply);
        return this.getById((await createdReply).id)
    }

    async CountCommentByProjet(projetId: number ): Promise<number> {
        return await this.commentRepository.createQueryBuilder()
            .leftJoinAndSelect("Comment.projet", "Projet")
            .where("Projet.id = :projetId", { projetId })
            .getCount();
          
        }

     async CountReplyByComment(commentId: number ): Promise<number> {
        const comment = this.getById(commentId);
        return (await comment).replies.length
                
      }

    // async likeComment(token: string, commentId: number): Promise<boolean> {
    //     return await this.likeUnlikeCommentHelper(token, commentId, 'like');
    //   }
    // likeUnlikeCommentHelper(token: string, commentId: number, type: 'like' | 'unlike',): boolean | PromiseLike<boolean> {
    
    // const user = await this.authService.getUserFromSessionToken(token);

    // const comment =  this.getById(commentId);
    // if (!comment) {
    //   throw new NotFoundException('Comment not found');
    // }

    // return type === 'like'
    /*   ?   likesService.likeComment(comment, user)*/
    //   :   likesService.unlikeComment(commentId, user.id);
    // }

}

export default new CommentService();