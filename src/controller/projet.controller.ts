import { Request, Response } from 'express';
import { BadRequestException } from '../error/BadRequestException.error';
import { Controller, Get, Post, Body, Delete, Put, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import projetService from '../service/projet.service';
import { PostProjetDTO } from '../dto/post.projet.dto';
import categoryService from '../service/category.service';
import { Projet } from '../model/projet';
import { PutProjetDTO } from '../dto/put.projet.dto';
import userService from '../service/user.service';

@ApiTags('Projet')
@Controller('api/v1/projet')
export class ProjetController {
    @ApiOperation({description: 'Get list of projet'})
    @Get('/')
    public async getProjets(req: Request, res: Response) {
        res.status(200).json((await projetService.getAllProjet()).map((projet) => ({ ...projet })));
    }

    @ApiOperation({ description: 'Create a new projet' })
    @ApiBody({
        // type: PostProjetDTO,
        description: 'infos about the new projet',
    })
    @Post('/')
    public async createProjet(req: Request, res: Response) {
        const {title, description,resume,rapport,image,presentation,videoDemo,codeSource,prix , category} = req.body
        // const {userEmail} = req.body
        if (!category ) {
            throw new BadRequestException('Missing required fields');
        }

        let $category = await categoryService.getByName(category);
        if (!$category) {
            throw new NotFoundException('Cannot find category ' + category);
        }

        const proj = new Projet()
        proj.title = title
        proj.description = description
        proj.resume = resume
        proj.rapport = rapport
        proj.image = image
        proj.presentation = presentation
        proj.videoDemo = videoDemo
        proj.codeSource = codeSource
        proj.prix = prix
        proj.category = $category

        const newProjet = await projetService.createProj(proj/*,userEmail*/);
        res.status(201).json({ ...newProjet, category: proj.category.name });


    }

    @ApiOperation({ description: 'Get details of a projet' })
    @ApiResponse({
        status: 404,
        description: 'Projet not found',
    })
    @Get('/:projetId')
    public async projetById(req: Request, res: Response) {
        const projetId = Number(req.params.projetId);

        res.status(200).json({ ...await projetService.getById(projetId) });
    }

    @ApiOperation({ description: 'Modify a projet' })
    @ApiBody({
        type: PutProjetDTO,
        description: 'infos to be updated',
    })
    @ApiResponse({
        status: 404,
        description: 'Projet not found',
    })
    @Put('/:projetId')
    public async updateProjet(req: Request, res: Response) {
        const {title, description,resume,rapport,image,presentation,videoDemo,codeSource,prix } = req.body;

        const projetId = Number(req.params.projetId);
        const projet = await projetService.getById(projetId);

        if (!projet) {
            throw new NotFoundException('Projet not found');
        }

        projet.title = title || projet.title;
        projet.description = description ||projet.description;
        projet.resume = resume || projet.resume;
        projet.rapport = rapport || projet.rapport;
        projet.image = image || projet.image;
        projet.presentation = presentation || projet.presentation;
        projet.videoDemo = videoDemo || projet.videoDemo;
        projet.codeSource = codeSource || projet.codeSource;
        projet.prix = prix || projet.prix
       

        const updatedProjet = await projetService.update(Number(projetId), projet);

        return res.status(200).json({ ...updatedProjet });
    }

    @ApiOperation({ description: 'Delete a projet from the database.' })
    @ApiResponse({
        status: 404,
        description: 'Projet not found',
        schema: {
            type: 'empty object',
            example: {}
        }
    })
    @Delete('/:projetId')
    public async deleteProjet(req: Request, res: Response) {
        const { projetId } = req.params;

        const projet = await projetService.getById(Number(projetId));

        if (!projet) {
            throw new NotFoundException('Course not found');
        }

        await projetService.deleteProjetById(projet.id);

        return res.status(200).json({});
    }

    @ApiOperation({description: 'count projet'})
    @ApiResponse({
        schema: {
            example: 2
        }
    })
    @Get('/count')
    async getCount() {
    try {
      return await projetService.getCount();
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

    @ApiOperation({description:'count projet by category'})
    @ApiResponse({
        schema: {
            example: 2
        }
    })
    @Get('category/:categoryId/count')
    async getCountByCategory(@Param('categoryId') categoryId: number) {
    try {
      const category = await categoryService.getById(categoryId);
      return await projetService.getProjetsCountByCategory(category);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NO_CONTENT);
    }
  }

  @ApiOperation({ description: 'Get a list of projets for a given user' })
  @ApiOkResponse(
      {
          description: 'Projets list',
          schema: {
              type: 'Projet[]',
            example: [{ id: 3, title: "lablib-api", description: 'plateforme d\'apprentissage',resume:'resume.docs',rapport:'rapport.docs',presentation:'presentation.ppt' }]
          }
      }
  )
  @Get('/:userId/list')
  public async allProjetsByUser(req: Request, res: Response) {
      const { userId} = req.params;
      const user = await userService.getById(Number(userId));

      if (!user) {
          throw new NotFoundException('User not found');
      }

      let projets = await projetService.getProjetByUser(Number(userId));
      res.status(200).json(projets);
  }

    
}
export default new ProjetController();