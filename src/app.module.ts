import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CommentController } from './controller/comment.controller';
import { ProjetController } from './controller/projet.controller';
import { UserController } from './controller/user.controller';
import { CategoryService } from './service/category.service';
import { CommentService } from './service/comment.service';
import { ProjetService } from './service/projet.service';
import { NoteService } from './service/note.service';
import { NoteController } from './controller/note.controller';
import { FileController } from './controller/file.controller';
import { FileService } from './service/file.service';
import {SearchService} from './service/search.service';
import {SearchController} from './controller/search.controller';

@Module({
  controllers: [UserController,CategoryController,ProjetController,CommentController,NoteController, FileController,SearchController],
  providers: [CategoryService,ProjetService,CommentService,NoteService ,FileService,SearchService],
})

export class AppModule { } 