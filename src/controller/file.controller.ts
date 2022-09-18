import { Request, Response } from 'express';
import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import fileService from '../service/file.service';
import sharp from 'sharp';
@ApiTags('file')
@Controller('api/v1/file')
export class FileController {

    @ApiOperation({ description: 'Get the requested file.' })
    @ApiOkResponse({
        description: 'Get a file given uuid',
        type: String,
    })
    @Get('/:uuid')
    public async getFile(req: Request, res: Response) {
        const { uuid } = req.params;
        let file = await fileService.getById(uuid);
        if (!file) {
            throw new NotFoundException('file not found');
        }
        res.status(200).send(file.content);
    }

    @ApiOperation({ description: 'Get the requested file.' })
    @ApiOkResponse({
        description: 'Get a file given uuid',
        type: String,
    })
    @Get('/:uuid/original_name')
    public async getFileOriginal_Name(req: Request, res: Response) {
        const { uuid } = req.params;
        const file = await fileService.getById(uuid);
        if (!file) {
            throw new NotFoundException('file not found');
        }
        res.status(200).json(file.original_name);
    }

}
export default new FileController();