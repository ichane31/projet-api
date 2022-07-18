import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Comment } from '../model/comment';
import {  Injectable, NotFoundException } from '@nestjs/common';
import  projetService from './projet.service';
import userService from './user.service';
import { User } from '../model/user';
// import  userService  from './user.service';

@Injectable()
export class CommentService {

    private commentRepository: Repository<Comment>;

    constructor() {
        this.commentRepository = PostgresDataSource.getRepository(Comment);
    }

    public async getComments(projetId: number, page: number = 1): Promise<Comment[]> {
        return this.commentRepository.createQueryBuilder()
            .leftJoin("Comment.projet", "Projet")
            .leftJoinAndSelect("Comment.author" , "User.firstName")
            .where("Projet.id = :projetId", { projetId })
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

    
    async createReply(reply: Comment, comment: Comment,user:User): Promise<Comment> {
        // const comment = await this.commentRepository.findOne({where:{id:commentId}});
        // const user = await this.userRepository.findOne({where:{id:userId}});
        const createdReply =  this.commentRepository.create({...reply,
        author: user});
        createdReply.commentParent = comment;
        await this.commentRepository.save(createdReply);
        return this.getById(createdReply.id)
    }

    async replyToComment(parentId: number,userId: number,reply:Comment): Promise<Comment> { 
        try {
            // Get comment to reply to
            const commentParent = await this.commentRepository
              .createQueryBuilder()
              .leftJoinAndSelect('Comment.replies', 'Comment')
              .where('commentParent.id = :id', { id: parentId })
              .getOne();

            if (!commentParent) {
                throw new NotFoundException('Cannot find comment ' + parentId);
            }
            //Get user 
            const user = await userService.getById(userId);
            // // insert new reply and return reply id
            const result = await this.createReply(reply,commentParent,user)
            // // return new reply and add to post
             const replyComment = await this.getById(result.id);
            commentParent.replies = [...commentParent.replies, replyComment];
            return await this.commentRepository.save(commentParent);
          } catch (err) {
            throw err;
          }
          return
    }
}

export default new CommentService();