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
import { ContactController } from './controller/contact.controller';
import { ContactService } from './service/contact.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { TwitterStrategy } from './strategy/twitter.strategy';
import { AuthService } from './service/socialAuth.service';
import { SocialAuthController } from './controller/socialAuth.controller';

@Module({
  controllers: [UserController,CategoryController,ProjetController,CommentController,NoteController, FileController,SearchController,ContactController ,/*SocialAuthController*/],
  providers: [CategoryService,ProjetService,CommentService,NoteService ,FileService,SearchService, ContactService , /*GoogleStrategy , FacebookStrategy , TwitterStrategy , AuthService*/],
})

export class AppModule { } 