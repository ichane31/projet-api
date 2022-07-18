import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostgresDataSource } from '../config/datasource.config';
import {File} from '../model/files';
 
@Injectable()
class DatabaseFilesService {
    private filesRepository: Repository<File>;

    constructor() {
        this.filesRepository = PostgresDataSource.getRepository(File);
    }
 
  async uploadDatabaseFile(dataBuffer: Buffer, filename: string) {
    const newFile = this.filesRepository.create({
      filename,
      data: dataBuffer
    })
    await this.filesRepository.save(newFile);
    return newFile;
  }
 
  async getFileById(id: number) {
    const file = await this.filesRepository.findOne({where:{id},
    relations: ['projet']});
    if (!file) {
      throw new NotFoundException(`This ${id} is not found`);
    }
    return file;
  }
}
 
export default DatabaseFilesService;