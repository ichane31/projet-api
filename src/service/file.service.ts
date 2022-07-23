import { DeleteResult, Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import { Injectable } from '@nestjs/common';
import { Files } from '../model/files';
import { valideFile } from '../middleware/fileType.middleware';

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

    public async saveFile (type : string , file : any ) :Promise<string> {
         
         if(valideFile(type, file.mimetype, file.size)) {
         const newFile =  new Files();
         newFile.content = file.data;
         let addFile =await this.create(newFile);
         return ( addFile).id;
         }
      return "veuillez bien choisir le fichier";
         
    }
}

export default new FileService();