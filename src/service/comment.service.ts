import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Comment } from '../model/comment';
import {  Injectable, NotFoundException } from '@nestjs/common';
import  projetService from './projet.service';
import userService from './user.service';
import { User } from '../model/user';
import { Projet } from '../model/projet';


@Injectable()
export class CommentService {

    private commentRepository: Repository<Comment>;

    constructor() {
        this.commentRepository = PostgresDataSource.getRepository(Comment);
    }

    // public async getComments(projetId: number , page = 1, take = 25): Promise<Comment[]> {
    //     return this.commentRepository.createQueryBuilder()
    //         .leftJoinAndSelect("Comment.projet", "Projet")
    //         .leftJoinAndSelect('Comment.author','User')
    //         //.innerJoinAndSelect("Comment.replies","Comment")
    //         .where("Projet.id = :projetId", { projetId })
    //         .skip((page - 1) * take)
    //         .take(take)
    //         .orderBy('Comment.createdDate','DESC')
    //         .getMany();
    // }

    public async getAll(): Promise<Comment[]> {
        return this.commentRepository.find({ relations: ['projet', 'author', 'commentParent' ,'replies', 'replies.author' , 'replies.replies','replies.replies.replies' ] });
    }

    public async getReplies(parentId: number): Promise<Comment[]> {
        return (await this.getAll()).filter(x => x.commentParent?.id === parentId);
    }

    public async getComments(projetId: number): Promise<Comment[]> {
        return (await this.getAll()).filter(x => x.projet?.id === projetId);
    }
    
    public async getCommentsParents(projetId: number): Promise<Comment[]> {
        return (await this.getComments(projetId)).filter(x => x.commentParent === null);
    }

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

    async CountCommentByProjet(projetId: number ): Promise<number> {
        return await this.commentRepository.createQueryBuilder()
            .leftJoinAndSelect("Comment.projet", "Projet")
            .where("Projet.id = :projetId", { projetId })
            .getCount();
          
        }

    //  async CountReplyByComment(commentId: number ): Promise<number> {
    //     const comment = this.getById(commentId);
    //     return (await comment).replies.length
                
    //   }

    

}

export default new CommentService();