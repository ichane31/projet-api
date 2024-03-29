import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';
// import session from 'express-session';
// import cookieSession from 'cookie-session';
import express, { Application } from 'express';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { config } from './config/env.config';
import { securityMiddleware } from './config/security.config';
import { errorHandler } from './error/errorhandler.handler';
import { NotFoundException } from './error/NotFoundException.error';
import categoryRouter from './route/category.router';
import projetRouter from './route/projet.router';
import commentRouter from './route/comment.route';
import userRouter from './route/user.router';
import noteRouter from './route/note.router';
import searchRouter from './route/search.router';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import  methodOverride from 'method-override';
import fileRouter from './route/file.router';
import sessionService from './service/session.service';
import { decodeUser } from './middleware/decodeuser.middleware';
import contactRouter from './route/contact.router';


export class App {

    private _app: Application;
    private app: INestApplication;
    private _origins: string[] = ["http://localhost:3000"];

    constructor() {
        
        this._app = express();
        this._app.set('trust proxy' ,1);
        this._app.use(bodyParser.urlencoded({ extended: true  , limit : '10mb'}));
        this.mapMiddleware();
        this.mapRoutes();


        /**
         * Not Found HandlSer
         */

        

        /**
         * Error Handler
         */
        this._app.use(errorHandler);

    }

    private mapRoutes() {

        /**
         * Add your routes here
         */

        this._app.use('/api/v1/user', userRouter.router);
        this._app.use('/api/v1/category', categoryRouter.router);
        this._app.use('/api/v1/projet', projetRouter.router);
        this._app.use('/api/v1/comment', commentRouter.router);
        this._app.use('/api/v1/note', noteRouter.router);
        this._app.use('/api/v1/file' ,fileRouter.router);
        this._app.use('/api/v1/search', searchRouter.router);
        this._app.use('/api/v1/contact', contactRouter.router);

        this._app.get('/', (req, res) => res.send('welcome to lablib_projet apis :) <div> <a href="/api/v1/category">start from here</a> </div>  <div> <a href="/docs">read the documentation</a> </div>'));
    }

    private mapMiddleware() {

        this._app.use(cors({
            origin:'*', credentials: true
        }))

        this._app.use(fileUpload({
            createParentPath: true,
            abortOnLimit: true
        }));

        this._app.use(methodOverride(function (req , res) {
            if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                // look in urlencoded POST bodies and delete it
                var method = req.body._method
                delete req.body._method
                return method
            }
        }))
        this._app.use(function(req , res , next ) {
            res.header("Access-control-Allow-Headers" , "Origin, X-Requested-With, Content-Type, Accept,authorization ");
            next();
        });
        
        
        this._app.use(
             decodeUser
         );
        this._app.use(express.json({
            limit: '10mb'
        }));

        // this._app.use(expressSession({
        //     secret: 'TWC_2018',
        //     resave: true,
        //     saveUninitialized: true,
        //   }));

    
    }

    private notFound(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        next(new NotFoundException());
    }

    private async bootstrap() {
        this.app = await NestFactory.create(AppModule, new ExpressAdapter(this._app));
        const _config = new DocumentBuilder()
            .setTitle('LabLib API')
            .setDescription('Learning Platform and much more...')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(this.app, _config);

        SwaggerModule.setup('docs', this.app, document);
        this._app.use(this.notFound);
    }

    public async listen(callback: () => void) {
        await this.bootstrap();
        return this.app.listen(config.port, callback);
    }

}
