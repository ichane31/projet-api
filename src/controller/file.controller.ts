import { Request, Response } from 'express';
import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import fileService from '../service/file.service';
import sharp from 'sharp';
@ApiTags('Image')
@Controller('api/v1/image')
export class FileController {

    @ApiOperation({ description: 'Get the requested image.' })
    @ApiOkResponse({
        description: 'image file',
        type: String,
    })
    @Get('/:uuid')
    public async getFile(req: Request, res: Response) {
        const { uuid } = req.params;
        let file = await fileService.getById(uuid);
        if (!file) {
            throw new NotFoundException('Image not found');
        }
        res.status(200).send(file.content);
    }

}
export default new FileController();