import { Request, Response } from 'express';
import { Category } from '../model/category';
import searchService from '../service/search.service';
import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchResult } from '../types/searchresult'
import { Course } from '../model/course';
import { Chapter } from '../model/chapter';
import { Projet } from '../model/projet';

@ApiTags('Search')
@Controller('api/v1/search')
export class SearchController {

    @ApiOperation({ description: 'Get list of entities that match the given search body' })
    @ApiOkResponse({
        description: 'List of the selected entities',
        type: SearchResult,
    })
    @Post('/')
    public async getResults(req: Request, res: Response) {
        const { search } = req.body;

        const categories = (await searchService.getCategories(search.text)).map((category) => ({ ...category, projets: category.projets.length }));
        const projets = (await searchService.getProjets(search.text)).map((projet) => ({ ...projet, comments: projet.commentCount ,notes: projet.notes.length }));

        res.status(200).json({ categories, projets, input: search.text });
    }
    @ApiOperation({ description: 'Get list of entities that match the given search query' })
    @ApiOkResponse({
        description: 'List of the selected entities',
        type: SearchResult,
    })
    @Get('/')
    public async getResultsQ(req: Request, res: Response) {
        let { q } = req.query;
        let search = q.toString();
        const categories = (await searchService.getCategories(search)).map((category) => ({ ...category, projets: category.projets.length }));
        const projets = (await searchService.getProjets(search)).map((projet) => ({ ...projet, comments: projet.commentCount , notes: projet.notes.length }));
        res.status(200).json({ categories, projets, input: search });
    }


    @ApiOperation({ description: 'Get list of categories that match the given search query' })
    @ApiOkResponse({
        description: 'List of the categories',
        type: Array<Category>,
    })
    @Post('/category')
    public async getCategories(req: Request, res: Response) {
        const { search } = req.body;
        const categories = await searchService.getCategories(search.text);
        res.status(200).json(categories.map((category) => ({ ...category, projets: category.projets.length })));
    }

    @ApiOperation({ description: 'Get list of projets that match the given search query' })
    @ApiOkResponse({
        description: 'List of the projets',
        type: Array<Projet>,
    })
    @Post('/projet')
    public async getProjets(req: Request, res: Response) {
        const { search } = req.body;
        const projets = await searchService.getProjets(search.text);
        res.status(200).json(projets.map((projet) => ({ ...projet, comments: projet.commentCount , notes:projet.notes.length })));
    }


    @ApiOperation({ description: 'Get list of categories that match the given search query' })
    @ApiOkResponse({
        description: 'List of the categories',
        type: Array<Category>,
    })
    @Get('/category')
    public async getCategoriesQ(req: Request, res: Response) {
        const { q } = req.query;
        const categories = await searchService.getCategories(q.toString());
        res.status(200).json(categories.map((category) => ({ ...category, projets: category.projets.length })));
    }

    @ApiOperation({ description: 'Get list of projets that match the given search query' })
    @ApiOkResponse({
        description: 'List of the projets',
        type: Array<Projet>,
    })
    @Get('/projet')
    public async getProjetsQ(req: Request, res: Response) {
        const { q } = req.query;
        const projets = await searchService.getProjets(q.toString());
        res.status(200).json(projets.map((projet) => ({ ...projet, comments: projet.commentCount , notes :projet.notes.length })));
    }

}

export default new SearchController();