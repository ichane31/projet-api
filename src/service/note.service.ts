import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Note } from '../model/note';
import { Injectable, NotFoundException } from '@nestjs/common';
import projetService from './projet.service';

@Injectable()
export class NoteService {

    private noteRepository: Repository<Note>;

    constructor() {
        this.noteRepository = PostgresDataSource.getRepository(Note);
    }

    public async updateNote(noteId: number, note: Note) {
        return this.noteRepository.save({ ...note, id: noteId });
    }

    public async createNote(note: Note ): Promise<Note> { 
        const createdNote =  this.noteRepository.save(note);
        return this.getById((await createdNote).id)
        
    }

    public async getById(id: number): Promise<Note | null> {
        return this.noteRepository.findOne({ where: { id } ,
        relations : ['projet','user']});
    }

    public async deleteNoteById(id: number/*, user: User*/): Promise<{ message: string }> {
        const comment = await this.noteRepository.delete(id/*,user.id*/ )

        if (comment.affected === 0) {
            throw new NotFoundException(`This ${id} is not found`)
        }
        return { message: 'Deleted successfully !' }
    }
    public async getNotes(projetId: number, page: number = 1): Promise<Note[]> {
        return this.noteRepository.createQueryBuilder()
            .leftJoin("Note.projet", "Projet")
            .leftJoinAndSelect("Note.user" , "User.firstName")
            .where("Projet.id = :projetId", { projetId })
            .take(25)
            .skip((page - 1) * 25)
            .getMany();
    }

    
    async CountNoteByProjet(projetId: number ): Promise<number> {
        const projet = await projetService.getById(projetId);
        if(projet){
            return projet.notes.length
        }
                
      }

      async getNotesCountByProjet(projetId: number ): Promise<number> {
        return await this.noteRepository.createQueryBuilder()
            .leftJoinAndSelect("Note.projet", "Projet")
            .where("Projet.id = :projetId", { projetId })
            .getCount();
          
        }
}

export default new NoteService();
