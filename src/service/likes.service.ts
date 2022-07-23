import { Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Injectable } from '@nestjs/common';
import { Likes } from '../model/likes';
import { User } from '../model/user';
import { Comment } from '../model/comment';
import { BadRequestException } from '../error/BadRequestException.error';

@Injectable()
export class LikesService {

	private likesRepository: Repository<Likes>;

	constructor() {
		this.likesRepository = PostgresDataSource.getRepository(Likes);
	}

    /**
     * @description like a comment
     */

     async likeComment(comment: Comment, user: User): Promise<boolean> {
        const alreadyLiked = await this.getLikedComment(comment.id, user.id);
    
        if (alreadyLiked) {
          return false;
        }
    
        const newLike = new Likes();
        newLike.comment = comment;
        newLike.user = user;
        
    
        const savedLike = await this.likesRepository.save(newLike);
        return savedLike !== null;
      }

      /**
   * @description unlike a comment
   */
  async unlikeComment(postId: number, userId: number): Promise<boolean> {
    const likedComment = await this.getLikedComment(postId, userId);

    if (!likedComment) {
      return false;
    }

    const unlikeComment = await this.likesRepository.delete(likedComment.id);
    return unlikeComment.affected === 1;
  }

  /**
   * @description helper method to get a liked comment
   */
  private async getLikedComment(
    commentId: number,
    userId: number,
  ): Promise<Likes> {
    if (!commentId || !userId) {
      throw new BadRequestException(
        'Post can only be liked/unliked if both user id and post id is provided',
      );
    }

    return await this.likesRepository
      .createQueryBuilder('likes')
      .leftJoinAndSelect('likes.comment', 'comment')
      .leftJoinAndSelect('likes.user', 'user')
      .where(`comment.id = :commentId`, { commentId })
      .where(`user.id = :userId`, { userId })
      .getOne();
  }

  

}