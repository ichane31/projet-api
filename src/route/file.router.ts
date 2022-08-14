import { Router } from "express";
import fileController from '../controller/file.controller';

class FileRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get('/:uuid' , fileController.getFile);
        this.router.get('/:uuid/original_name' , fileController.getFileOriginal_Name);
    }

}

export default new FileRouter();