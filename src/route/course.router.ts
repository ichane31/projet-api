import { Router } from "express";
import courseController, { CourseController } from "../controller/course.controller";

class CourseRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.get('/', courseController.allCourses);
        this.router.post('/', courseController.createCourse);
        this.router.get('/:courseId', courseController.courseById);
        this.router.put('/:courseId', courseController.updateCourse);
        this.router.delete('/:courseId', courseController.deleteCourse);
        this.router.get('/:courseId/list', courseController.allChaptersByCourse);
    }

}

export default new CourseRouter();