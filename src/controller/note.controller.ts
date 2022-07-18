import { Request, Response } from 'express';
import { BadRequestException } from '../error/BadRequestException.error';
import { Controller, Get, Post, Body, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import projetService from '../service/projet.service';
import noteService from '../service/note.service';
import { Note } from '../model/note';
import { PostNoteDTO } from '../dto/post.note.dto';
import userService from '../service/user.service';
import { PutNoteDTO } from '../dto/put.note.dto';


@ApiTags('Note')
@Controller('api/v1/note')
export class NoteController {
    
    @ApiOperation({ description: 'add a new note' })
    @ApiBody({
        type: PostNoteDTO,
        description: 'infos about the new note',
    })
    @Post('/:projetId')
    public async addNote(req: Request, res: Response) {
        const { note } = req.body;
        const {projetId /*, userEmail*/} = req.params;

        if (!projetId || !note/*|| !userEmail*/) {
            throw new BadRequestException('Missing required fields');
        }

        let $projet = await projetService.getById(Number(projetId));
        if (!$projet) {
            throw new NotFoundException('Cannot find projet ' + projetId);
        }
        // let $user = await userService.getByEmail(userEmail);
        const newNote = new Note();

        // newNote.user = $user;
        newNote.value = note;
        newNote.projet = $projet;
        const addNote = await noteService.createNote(newNote);

        res.status(201).json({ ...addNote, projet: newNote.projet.title });
    }

    @ApiOperation({ description: 'Get details of a note' })
    @ApiResponse({
        status: 404,
        description: 'Note not found',
    })
    @Get('/:noteId')
    public async getNoteById(req: Request, res: Response) {
        const noteId = Number(req.params.noteId);

        res.status(200).json({ ...await noteService.getById(noteId) });
    }

    @ApiOperation({ description: 'Modify a note' })
    @ApiBody({
        type: PutNoteDTO,
        description: 'infos to be updated',
    })
    @ApiResponse({
        status: 404,
        description: 'Note not found',
    })
    @Put('/:noteId')
    public async updateNote(req: Request, res: Response) {
        const { note} = req.body;

        const { noteId , userId } = req.params;
        const noteGet = await noteService.getById(Number(noteId));

        if (!noteGet) {
            throw new NotFoundException('Comment not found');
        }

    if(noteGet.user.id !== Number(userId)) {
        throw new HttpException('You do not own this note',
        HttpStatus.UNAUTHORIZED,)

    }

        noteGet.value = note || noteGet.value;

        const updatedNote = await noteService.updateNote(Number(noteId), noteGet);

        return res.status(200).json({ ...updatedNote });
    }

    @ApiOperation({ description: 'Delete a note from the database.' })
    @ApiResponse({
        status: 404,
        description: 'Note not found',
    })
    @Delete('/:noteId')
    public async deleteNote(req: Request, res: Response) {
        const { noteId } = req.params;
        const userId = req.currentUser.userId;

        const note = await noteService.getById(Number(noteId));


        if (!note) {
            throw new NotFoundException('Note not found');
        }
        
        if(note.user.id !== Number(userId)) {
            throw new HttpException('You do not own this note',
            HttpStatus.UNAUTHORIZED,)

        }

        await noteService.deleteNoteById(note.id);

        return res.status(200).json({});
    }

    @ApiOperation({ description: 'Get a list of note for a given projet' })
    @ApiResponse({
        status: 404,
        description: 'Projet not found',
    })
    @Get('/:projetId/list')
    public async getNoteByProjet(req: Request, res: Response) {
        const { projetId } = req.params;
        const projet = await projetService.getById(Number(projetId));

        if (!projet)
            throw new NotFoundException('Projet not found');

        let notes = await noteService.getNotes(Number(projetId));
        res.status(200).json(notes);
    }

}
export default new NoteController();
