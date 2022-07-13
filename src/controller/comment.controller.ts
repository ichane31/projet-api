import { Request, Response } from 'express';
import { BadRequestException } from '../error/BadRequestException.error';
import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import projetService from '../service/projet.service';
import commentService from '../service/comment.service';
import { Comment } from '../model/comment';
import { PostCommentDTO } from '../dto/post.comment.dto';
import userService from '../service/user.service';


@ApiTags('Comment')
@Controller('api/v1/course')
export class CommentController {
    
    @ApiOperation({ description: 'Create a new comment' })
    @ApiBody({
        type: PostCommentDTO,
        description: 'infos about the new comment',
    })
    @Post('/')
    public async createComment(req: Request, res: Response) {
        const { body } = req.body;
        const {projetId , userEmail} = req.params

        if (!projetId || !userEmail) {
            throw new BadRequestException('Missing required fields');
        }

        let $projet = await projetService.getById(Number(projetId));
        if (!$projet) {
            throw new NotFoundException('Cannot find projet ' + projetId);
        }
        let $user = await userService.getByEmail(userEmail);
        const comment = new Comment();

        comment.author = $user.firstName;
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
        const commentId = Number(req.params.commentId);

        res.status(200).json({ ...await commentService.getById(commentId) });
    }

    // @ApiOperation({ description: 'Modify a course' })
    // @ApiBody({
    //     type: PutCourseDTO,
    //     description: 'infos to be updated',
    // })
    // @ApiResponse({
    //     status: 404,
    //     description: 'Course not found',
    // })
    // @Put('/:commentId')
    // public async updateCourse(req: Request, res: Response) {
    //     const { body} = req.body;

    //     const { commentId } = req.params;
    //     const comment = await commentService.getById(Number(commentId));

    //     if (!comment) {
    //         throw new NotFoundException('Comment not found');
    //     }

    //     comment.body = body || comment.body;
    //     comment.name = name || course.name;

    //     const updatedComment = await commentService.update(Number(commentId), course);

    //     return res.status(200).json({ ...updatedComment });
    // }

    @ApiOperation({ description: 'Delete a comment from the database.' })
    @ApiResponse({
        status: 404,
        description: 'Comment not found',
    })
    @Delete('/:commentId')
    public async deleteComment(req: Request, res: Response) {
        const { commentsId } = req.params;

        const comment = await commentService.getById(Number(commentsId));

        if (!comment) {
            throw new NotFoundException('Comment not found');
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

}
export default new CommentController();