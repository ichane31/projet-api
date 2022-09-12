import { Request, Response } from 'express';
import { Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import authService from '../service/socialAuth.service';


@ApiTags('User')
@Controller('api/v1/socialAuth')
export class SocialAuthController {

    @ApiOperation({ summary: 'Signin the current user using google authentication' })
    @ApiResponse({ status: 200, description: 'The bearer access token.' })
    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleSign(@Req() req : Request) :Promise <any>{}

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleSignRedirect(@Req() req : Request , @Res() res: Response) :Promise <any>{
        await authService.google(req , res);
    }

    @ApiOperation({ summary: 'Signin the current user using facebook authentication' })
    @ApiResponse({ status: 200, description: 'The bearer access token.' })
    @Get('/facebook')
    @UseGuards(AuthGuard('google'))
    async facebookSign(@Req() req : Request) :Promise <any>{}

    @Get('/facebook/redirect')
    @UseGuards(AuthGuard('facebook'))
    async facebookSignRedirect(@Req() req : Request , @Res() res: Response) :Promise <any>{
        await authService.facebook(req , res);
    }

    @ApiOperation({ summary: 'Signin the current user using twitter authentication' })
    @ApiResponse({ status: 200, description: 'The bearer access token.' })
    @Get('/twitter')
    @UseGuards(AuthGuard('twitter'))
    async twitterSign(@Req() req : Request) :Promise <any>{}

    @Get('/twitter/redirect')
    @UseGuards(AuthGuard('facebook'))
    async twitterSignRedirect(@Req() req : Request , @Res() res: Response) :Promise <any>{
        await authService.twitter(req , res);
    }

}

export default new SocialAuthController();