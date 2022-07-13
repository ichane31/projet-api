import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Comment } from '../model/comment';
import {  Injectable, NotFoundException } from '@nestjs/common';
import  projetService from './projet.service';
// import  userService  from './user.service';

@Injectable()
export class CommentService {

    private commentRepository: Repository<Comment>;

    constructor() {
        this.commentRepository = PostgresDataSource.getRepository(Comment);
    }

    public async getComments(projetId: number): Promise<Comment[]> {
        return this.commentRepository.createQueryBuilder()
            .leftJoin("Comment.projet", "Projet")
            .where("Projet.id = :projetId", { projetId })
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
            relations:['projet']},
            );
    }

    // public async updateComment(commentId: number, comment: Comment) {
    //     return this.commentRepository.save({ ...comment, id: commentId });
    // }

    public async deleteCommentById(id: number/*, user: User*/): Promise<{ message: string }> {
        const comment = await this.commentRepository.delete(id/*,user.id*/ )

        if (comment.affected === 0) {
            throw new NotFoundException(`This ${id} is not found`)
        }
        return { message: 'Deleted successfully !' }
    }
}

export default new CommentService();