import { Router } from "express";
import fileController from '../controller/file.controller';

class FileRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get(':uuid' , fileController.getFile);
    }

}

export default new FileRouter();