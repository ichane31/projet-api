import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { ChapterController } from './controller/chapter.controller';
import { CourseController } from './controller/course.controller';
import { LabController } from './controller/lab.controller';
import { ProjetController } from './controller/projet.controller';
import { StepController } from './controller/step.controller';
import { CategoryService } from './service/category.service';
import { ChapterService } from './service/chapter.service';
import { CourseService } from './service/course.service';
import { LabService } from './service/lab.service';
import { ProjetService } from './service/projet.service';
import { StepService } from './service/step.service';

@Module({
  controllers: [CategoryController, CourseController, ChapterController, LabController, StepController,ProjetController],
  providers: [CategoryService, CourseService, ChapterService, LabService, StepService,ProjetService],
})

export class AppModule { }