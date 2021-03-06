import { Request, Response } from 'express';
import { BadRequestException } from '../error/BadRequestException.error';
import { Course } from '../model/course';
import courseService from '../service/course.service';
import categoryService from '../service/category.service';
import chapterService from '../service/chapter.service';
import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';

@ApiTags('Course')
@Controller('api/v1/course')
export class CourseController {
    @ApiOperation({ description: 'Get a list of courses' })
    @Get('/')
    public async allCourses(req: Request, res: Response) {
        res.status(200).json((await courseService.getAll()).map((course) => ({ ...course })));
    }

    @ApiOperation({ description: 'Create a new course' })
    @Post('/')
    public async createCourse(req: Request, res: Response) {
        const { name, category, description, image } = req.body;

        if (!category || !name) {
            throw new BadRequestException('Missing required fields');
        }

        if (await courseService.getByName(name)) {
            throw new BadRequestException('Course under this name already exists');
        }

        let $category = await categoryService.getByName(category);
        if (!$category) {
            throw new NotFoundException('Cannot find category ' + category);
        }
        const course = new Course();

        course.name = name;
        course.description = description;
        course.image = image;
        course.category = $category;
        const newCourse = await courseService.create(course);

        res.status(201).json({ ...newCourse, category: course.category.name });
    }

    @ApiOperation({ description: 'Get details of a course' })
    @Get('/:courseId')
    public async courseById(req: Request, res: Response) {
        const courseId = Number(req.params.courseId);

        res.status(200).json({ ...await courseService.getById(courseId) });
    }

    @ApiOperation({ description: 'Modify a course' })
    @Put('/:courseId')
    public async updateCourse(req: Request, res: Response) {
        const { name, category, description, image } = req.body;

        const { courseId } = req.params;
        const course = await courseService.getById(Number(courseId));

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        course.image = image || course.image;
        course.description = description || course.description;
        course.name = name || course.name;

        const updatedCourse = await courseService.update(Number(courseId), course);

        return res.status(200).json({ ...updatedCourse });
    }

    @ApiOperation({ description: 'Delete a course from the database.' })
    @Delete('/:courseId')
    public async deleteCourse(req: Request, res: Response) {
        const { courseId } = req.params;

        const course = await courseService.getById(Number(courseId));

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        await courseService.delete(course.id);

        return res.status(200).json({});
    }

    @Get('/:courseId/list')
    public async allChaptersByCourse(req: Request, res: Response) {
        const { courseId } = req.params;
        res.status(200).json({ ...await chapterService.getByCourse(Number(courseId)) });
    }

}
export default new CourseController();