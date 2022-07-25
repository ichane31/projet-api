import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Injectable } from '@nestjs/common';
import { Files } from '../model/files';
import { Errormessage, valideFile } from '../middleware/fileType.middleware';
import { Projet } from '../model/projet';
import { UnauthorizedError } from '../error/UnauthorizedError.error';

@Injectable()
export class FileService {

    private fileRepository: Repository<Files>;

    constructor() {
        this.fileRepository = PostgresDataSource.getRepository(Files);
    }

    public async getById(id: string): Promise<Files | null> {
        return this.fileRepository.findOne({ where: { id } });
    }

    public async create(image: Files): Promise<Files> {
        return this.fileRepository.save(image);
    }
    public async delete(id: string): Promise<DeleteResult> {
        return this.fileRepository.delete({ id });
    }

    public async saveFile (type : string , file : any )  {
         
        if(file){
         if(! valideFile(type, file.mimetype, file.size)) {
            throw new UnauthorizedError(Errormessage(type));
         }
         
         const newFile =  new Files();
         newFile.content = file.data;
         let addFile =await this.create(newFile);
         return ( addFile).id;
         
        }
    }

    public async deleteFiles ( projet : Projet) {
        if(projet.image || projet.resume || projet.rapport || projet.presentation || projet.videoDemo || projet.codeSource) {
          await this.delete(projet.image);
          await this.delete(projet.resume);
          await this.delete(projet.rapport);
          await this.delete(projet.presentation);
          await this.delete(projet.videoDemo);
          await this.delete(projet.codeSource);
        }
    }
}

export default new FileService();