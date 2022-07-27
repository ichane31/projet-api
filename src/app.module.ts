import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { ChapterController } from './controller/chapter.controller';
import { CommentController } from './controller/comment.controller';
import { CourseController } from './controller/course.controller';
import { LabController } from './controller/lab.controller';
import { ProjetController } from './controller/projet.controller';
import { StepController } from './controller/step.controller';
import { UserController } from './controller/user.controller';
import { CategoryService } from './service/category.service';
import { ChapterService } from './service/chapter.service';
import { CommentService } from './service/comment.service';
import { CourseService } from './service/course.service';
import { LabService } from './service/lab.service';
import { ProjetService } from './service/projet.service';
import { StepService } from './service/step.service';
import { NoteService } from './service/note.service';
import { NoteController } from './controller/note.controller';
import { FileController } from './controller/file.controller';
import { FileService } from './service/file.service';

@Module({
  controllers: [UserController,CategoryController/*, CourseController, ChapterController, LabController, StepController*/,ProjetController,CommentController,NoteController, FileController],
  providers: [CategoryService/*, CourseService, ChapterService, LabService, StepService*/,ProjetService,CommentService,NoteService ,FileService],
})

export class AppModule { } 