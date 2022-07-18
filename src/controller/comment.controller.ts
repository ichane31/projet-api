import { Request, Response } from 'express';
import { BadRequestException } from '../error/BadRequestException.error';
import { Controller, Get, Post, Body, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import projetService from '../service/projet.service';
import commentService from '../service/comment.service';
import { Comment } from '../model/comment';
import { PostCommentDTO } from '../dto/post.comment.dto';
import userService from '../service/user.service';
import { PutCommentDTO } from '../dto/put.comment.dto';


@ApiTags('Comment')
@Controller('api/v1/comment')
export class CommentController {
    
    @ApiOperation({ description: 'Create a new comment' })
    @ApiBody({
        type: PostCommentDTO,
        description: 'infos about the new comment',
    })
    @Post('/:projetId')
    public async createComment(req: Request, res: Response) {
        const { body } = req.body;
        const {projetId /*, userEmail*/} = req.params

        if (!projetId || !body/*|| !userEmail*/) {
            throw new BadRequestException('Missing required fields');
        }

        let $projet = await projetService.getById(Number(projetId));
        if (!$projet) {
            throw new NotFoundException('Cannot find projet ' + projetId);
        }
        // let $user = await userService.getByEmail(userEmail);
        const comment = new Comment();

        // comment.author = $user;
        comment.body = body;
        comment.projet = $projet;
        const newComment = await commentService.createComment(comment);

        res.status(201).json({ ...newComment, projet: comment.projet.title });
    }

    @ApiOperation({ description: 'Get details of a comment' })
    @ApiResponse({
        status: 404,
        description: 'Comment not found',
    })
    @Get('/:commentId')
    public async commentById(req: Request, res: Response) {
        const commentId = Number(req.params.id);
        const comment = await commentService.getById(commentId);

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        res.status(200).json({ ...comment });
    }

    @ApiOperation({ description: 'Modify a comment' })
    @ApiBody({
        type: PutCommentDTO,
        description: 'infos to be updated',
    })
    @ApiResponse({
        status: 404,
        description: 'Comment not found',
    })
    @Put('/:commentId')
    public async updateComment(req: Request, res: Response) {
        const { body} = req.body;

        const { commentId , userId } = req.params;
        const comment = await commentService.getById(Number(commentId));

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

    if(comment.author.id !== Number(userId)) {
        throw new HttpException('You do not own this comment',
        HttpStatus.UNAUTHORIZED,)

    }

        comment.body = body || comment.body;

        const updatedComment = await commentService.updateComment(Number(commentId), comment);

        return res.status(200).json({ ...updatedComment });
    }

    @ApiOperation({ description: 'Delete a comment from the database.' })
    @ApiResponse({
        status: 404,
        description: 'Comment not found',
    })
    @Delete('/:commentId')
    public async deleteComment(req: Request, res: Response) {
        const { commentsId } = req.params;
        const userId = req.currentUser.userId;

        const comment = await commentService.getById(Number(commentsId));


        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        
        if(comment.author.id !== Number(userId)) {
            throw new HttpException('You do not own this comment',
            HttpStatus.UNAUTHORIZED,)

        }

        await commentService.deleteCommentById(comment.id);

        return res.status(200).json({});
    }

    @ApiOperation({ description: 'Get a list of comments for a given projet' })
    @ApiResponse({
        status: 404,
        description: 'Projet not found',
    })
    @Get('/:projetId/list')
    public async getCommentsByProjet(req: Request, res: Response) {
        const { projetId } = req.params;
        const projet = await projetService.getById(Number(projetId));

        if (!projet)
            throw new NotFoundException('Projet not found');

        let comments = await commentService.getComments(Number(projetId));
        res.status(200).json(comments);
    }

    @ApiOperation({ description: 'reply on comment' })
    @ApiBody({
        type: PostCommentDTO,
        description: 'infos about the new reply comment',
    })
    @Post('/:commentId')
    public async replyToComment(req: Request, res: Response) {
        const { body } = req.body;
        const parentId /*, userEmail*/ = Number(req.params.commentId);
        const userId = req.currentUser.userId

        if (!parentId /*|| !userId*/) {
            throw new BadRequestException('Missing required fields');
        }

        const reply = new Comment();

        // comment.author = $user;
        reply.body = body;
    
        return await commentService.replyToComment(parentId,userId,reply);

    }

}
export default new CommentController();
