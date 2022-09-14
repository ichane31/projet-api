import { Request, Response } from 'express';
import { BadRequestException } from '../error/BadRequestException.error';
import { Controller, Get, Post, Body, Delete, Put, HttpException, HttpStatus, Param, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import projetService from '../service/projet.service';
import { PostProjetDTO } from '../dto/post.projet.dto';
import categoryService from '../service/category.service';
import { Projet } from '../model/projet';
import { PutProjetDTO } from '../dto/put.projet.dto';
import userService from '../service/user.service';
import { number } from 'joi';
import fileService from '../service/file.service';

@ApiTags('Projet')
@Controller('api/v1/projet')
export class ProjetController {
    @ApiOperation({description: 'Get list of projet'})
    @Get('/')
    public async getProjets(req: Request, res: Response) {
        let defaultImage = await fileService.getDefaultImage();
        res.status(200).json((await projetService.getAllProjet()).map((projet) => ({ ...projet,category :projet.category.name, Comments: projet.comments.length, notes: projet.notes.length ,image :projet.image || defaultImage })));
    }

    @ApiOperation({ description: 'Create a new projet' })
    @ApiBody({
        type: PostProjetDTO,
        description: 'infos about the new projet'
    })
    @ApiOkResponse(
        {
            description: 'Projet created',
            schema: {
                type: 'Projet',
                
            }
        }
    )
    @ApiResponse({
        status: 401,
        description: 'returned if the body request has missing required fields ',
    })
    @Post('/')
    public async createProjet(req: Request, res: Response) {
        const {title, description,prix , category} = req.body;
        const userId = req.currentUser.userId;
        if (!category || !title) {
            throw new BadRequestException('Missing required fields');
        }

        let $category = await categoryService.getByName(category);
        if (!$category) {
            throw new NotFoundException('Cannot find category ' + category);
        }
        const proj = new Projet();
        if (req.files) {
             
        const {image , resume , rapport , presentation , videoDemo , codeSource} = req.files;
        proj.image = await fileService.saveFile("image" , image);
        proj.resume =await  fileService.saveFile("resume" , resume);
        proj.rapport = await  fileService.saveFile("rapport" , rapport);
        proj.presentation = await fileService.saveFile("presentation" , presentation);
        proj.videoDemo = await fileService.saveFile("video" , videoDemo);
        proj.codeSource = await fileService.saveFile("code" , codeSource);

        }
        const user = await userService.getById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }


        proj.title = title;
        proj.description = description;
        proj.prix = prix;
        proj.category = $category;
        proj.author = user;

        const newProjet = await projetService.createProj(proj);
        user.projets?.push(newProjet);
        await userService.update(userId, user);
        let defaultImage = await fileService.getDefaultImage();
        res.status(201).json({ ...newProjet, category: proj.category.name , comments:0, notes: 0, image: proj.image || defaultImage});


    }

    @ApiOperation({ description: 'Get details of a projet' })
    @ApiParam({
        name: 'projetId',
        description: 'id of the projet',
        allowEmptyValue: false,
        type: number,
        examples: { a: { summary: 'id of the projet is 5', value: 5 } }
    })
    @ApiResponse({
        status: 404,
        description: 'Projet not found',
    })
    @Get('/:projetId')
    public async projetById(req: Request, res: Response) {
        const projetId = Number(req.params.projetId);
        const projet = await projetService.getById(projetId);
        if(!projet) {
            throw new NotFoundException('Projet not found')
        }
        let defaultImage = await fileService.getDefaultImage();

        res.status(200).json({ ... projet,
        category: projet.category.name,
        Comments :projet.commentCount,
        Notes: projet.notes.length,
        image: projet.image || defaultImage});
    }

    @ApiOperation({ description: 'Modify a projet' })
    @ApiParam({
        name: 'projetId',
        description: 'id of the projet',
        allowEmptyValue: false,
        type: number,
        examples: { a: { summary: 'id of the category is 5', value: 5 } }
    })
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
        const {title, description,prix , category } = req.body;
        const userId = req.currentUser.userId;
        
        const projetId = Number(req.params.projetId);
        const projet = await projetService.getById(projetId);

        if (!projet) {
            throw new NotFoundException('Projet not found');
        }

        const user = await userService.getById(userId);
        if(projet.author === null) {
            projet.author = user;
            user.projets?.push(projet);
            await userService.update(userId, user);
        }
        
        else if(projet.author.id !== user.id) {
            throw new UnauthorizedException('ce projet ne vous appartient pas ');
        }
        if(req.files) {
            const {image , resume , rapport , presentation , videoDemo , codeSource} = req.files;
            await fileService.deleteFiles(projet);
            projet.image = await fileService.saveFile("image" , image);
            projet.resume = await fileService.saveFile("resume" , resume);
            projet.rapport = await fileService.saveFile("rapport" , rapport);
            projet.presentation = await fileService.saveFile("presentation" , presentation);
            projet.videoDemo = await fileService.saveFile("video" , videoDemo);
            projet.codeSource = await fileService.saveFile("code" , codeSource);

        }
        if (typeof category !== 'undefined') {
            let $category = await categoryService.getByName(category);
            if (!$category) {
                throw new NotFoundException('Cannot find category ' + category);  
            }
            projet.category = $category;
        }

        projet.title = title || projet.title;
        projet.description = description ||projet.description;
        projet.prix = prix || projet.prix
       

        const updatedProjet = await projetService.update(Number(projetId), projet);

        return res.status(200).json({ ...updatedProjet,category: updatedProjet.category.name,comments: updatedProjet.commentCount, notes: updatedProjet.notes.length });
    }

    @ApiOperation({ description: 'Delete a projet from the database.' })
    @ApiParam({
        name: 'projetId',
        description: 'id of the projet',
        allowEmptyValue: false,
        type: number,
    })
    @ApiOkResponse({
        description: 'projet is deleted successfully',
        schema: {
            type: 'empty object',
            example: {}
        }
    })
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
        const userId = req.currentUser.userId;

        const projet = await projetService.getById(Number(projetId));

        if (!projet) {
            throw new NotFoundException('Projet not found');
        }

        await fileService.deleteFiles(projet);
        
        const user = await userService.getById(userId);
        if(! projetService.ensureOwnership(user,projet)) {
            throw new UnauthorizedException();
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
    async Count(req: Request , res: Response) {
   
        let nbre = await projetService.count();
        res.status(200).json(nbre);
    
  }

    @ApiOperation({description:'count projet by category'})
    @ApiParam({
        name: 'categoryId',
        description: 'id of the category',
        allowEmptyValue: false,
        type: number,
    })
    @ApiResponse({
        schema: {
            example: 2
        }
    })
    @Get('/:categoryId/count')
    async getCountByCategory(req: Request , res: Response) {
        const categoryId = Number(req.params.categoryId);
    
      const category = await categoryService.getById(categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
    }
      let nbre = await projetService.getProjetsCountByCategory(categoryId);
        res.status(200).json(nbre);
    }

  @ApiOperation({description:'count projet by user'})
  @ApiParam({
    name: 'userId',
    description: 'id of the user',
    allowEmptyValue: false,
    type: number,
    examples: { a: { summary: 'id of the user is 5', value: 5 } }
})
  @ApiResponse({
      schema: {
          example: 2
      }
  })
  @Get('/:userId/count')
  async getCountByUser(req: Request , res: Response) {
      const userId = req.currentUser.userId;
  
    const user = await userService.getById(userId);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    let nbreU = await projetService.getProjetsCountByUser(userId);
        res.status(200).json(nbreU);
 
}

  @ApiOperation({ description: 'Get a list of projets for a given user' })
  @ApiParam({
    name: 'userId',
    description: 'id of the user',
    allowEmptyValue: false,
    type: number,
    examples: { a: { summary: 'id of the category is 5', value: 5 } }
})
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
      res.status(200).json(projets.map(((projet) => ({ ...projet, user: projet.author.firstname,
         comments: projet.commentCount, notes:projet.notes.length }))));
  }

  @ApiOperation({ description: 'favorite a projet' })
  @ApiParam({
    name: 'projetId',
    description: 'id of the projet',
    allowEmptyValue: false,
    type: number,
    examples: { a: { summary: 'id of the projet is 2', value: 2 } }
})
  @ApiOkResponse(
      {
          description: 'favorited projet',
          schema: {
              type: 'Projet',
            
          }
      }
  )
  @Post('/:projetId/favorite')
  public async favoriteProjet(req: Request , res: Response) {
      const projetId = Number(req.params.projetId);
      const userId = req.currentUser.userId;

      const projet = await projetService.getById(projetId);
      if(!projet) {
        throw new NotFoundException('Projet not found');
      }

      const user = await userService.getById(userId);
      if(!user) { throw new NotFoundException('Invalid user');}
      if(projet.favoritedBy.filter(fav => fav.id === userId).length >0) {
        return res.status(400).json({msg:'Projet already add to favourites'});
      }
      const favProjet = await projetService.favoriteProjet(projetId, user);
      await userService.update(userId , user);
      return res.status(200).json({ ...favProjet,comments: favProjet.commentCount, notes: favProjet.notes.length, favorites: favProjet.favoritesCount });
    
  }

@ApiOperation({ description: 'unfavorite a projet' })
@ApiParam({
    name: 'projetId',
    description: 'id of the projet',
    allowEmptyValue: false,
    type: number,
    examples: { a: { summary: 'id of the projet is 2', value: 2 } }
})
@ApiOkResponse(
      {
          description: 'unfavorite projet',
          schema: {
              type: 'Projet',
            
          }
      }
  )
@Delete('/:projetId/unfavorite')
public async unfavoriteProjet(req: Request , res: Response){
    const projetId = Number(req.params.projetId);
    const userId = req.currentUser.userId;

    const projet = await projetService.getById(projetId);
    if(!projet) {
      throw new NotFoundException('Projet not found');
    }

    const user = await userService.getById(userId);
    if(!user) {
        throw new NotFoundException('User not found');
      }
    
    if(projet.favoritedBy.filter(fav => fav.id === userId).length ===0) {
        return res.status(400).json({msg:'Projet has not yet been add to favourites'});
      }
    const unfavProjet = await projetService.unfavoriteProjet(projetId, user);
    await userService.update(userId, user);
      return res.status(200).json({ ...unfavProjet,comments: unfavProjet.commentCount, notes: unfavProjet.notes.length, favorites: unfavProjet.favoritesCount });

}

@ApiOperation({ description: 'Get a list of last added projets' })
    @Get('/latest/:count')
    public async getlatestProjets(req: Request, res: Response) {
        const { count } = req.params;
        const projets = await projetService.getCount(Number(count));
        res.status(200).json(projets.map(projet => { return { ...projet ,category: projet.category.name , Comments: projet.commentCount , notes: projet.notes.length}}))
    }

    
@ApiOperation({ description: 'Get a list of favorites projets' })
@Get('/favorites/:count')
public async getFavoriteProjets(req: Request, res: Response) {
    const { count } = req.params;
    let  userId  = req.currentUser.userId;
    let user = await userService.getById(userId);
    if (!user) {
        throw new NotFoundException('Invalid user');
    }
    const projets = (user.favorites || []).slice(0 ,Number(count));
    res.status(200).json(projets.map(projet => { return {...projet,category: projet.category.name, comments: projet.commentCount, notes: projet.notes.length }}));
}

@ApiOperation({ description: 'Get a list of favorites projets' })
@Get('/favorites')
public async getAllFavoriteProjets(req: Request, res: Response) {
    
    let  userId  = req.currentUser.userId;
    let user = await userService.getById(userId);
    if (!user) {
        throw new NotFoundException('Invalid user');
    }
    const projets = user.favorites ;
    res.status(200).json(projets.map(projet => { return {...projet,category: projet.category.name, comments: projet.commentCount, notes: projet.notes.length }}));
}

@ApiOperation({ description: 'Get a list of recommendations for a projet' })
    @Get('/suggestions/:count')
    public async getSuggestions(req: Request, res: Response) {
        const { count } = req.params;
        let { userId } = req.currentUser;
        let user = await userService.getByIdWithDeepFavoriteBy(userId);
        if (!user) {
            throw new NotFoundException('Invalid user');
        }
        const projets = user.favorites.map(p => p.favoritedBy.map(f => f.favorites.map($ => $.id))).flat(2);
        let i = [], cs = [];
        projets.forEach(c => {
            if (!(cs.includes(c))) { i.push(0); cs.push(c); }
            i[cs.indexOf(c)] += 1;
        });

        let used = user.favorites.map(c => c.id), max = 0, mxi;
        for (let y of cs) {
            for (let j of cs) {
                if (used.includes(j)) continue;
                let $ = i[cs.indexOf(j)];
                if ($ > max) { max = $; mxi = j; }
            }
            used.push(mxi);
            if (used.length - user.favorites.length == Number(count)) break;
        }

        res.status(200).json(used.slice(user.favorites.length));
    }

}
export default new ProjetController();