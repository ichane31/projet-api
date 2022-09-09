import { Request, Response } from 'express';
import { BadRequestException } from '../error/BadRequestException.error';
import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../error/NotFoundException.error';
import { number } from 'joi';
import { UnauthorizedError } from '../error/UnauthorizedError.error';
import {PostContactDTO} from '../dto/post.contact.dto';
import { PutContactDTO} from '../dto/put.contact.dto';
import { Contact  } from '../model/contact';
import contactService from '../service/contact.service';
import emailService from '../service/email.service';
import userService from '../service/user.service';

@ApiTags('Contact')
@Controller('api/v1/contact')
export class ContactController {

    @ApiOperation({ description: 'Get a list of contact question' })
    @ApiOkResponse({
        description: 'List of all contact questions ',
        schema: {
            type: 'Contact[]',
            example: [{ id: 5, name: "Ichane", email: 'infos@gmail.com'  , subject: "Question sur projet" , message: "Question de comprehension sur projet"},]
        }
    })
    @Get('/')
    public async allContacts(req: Request, res: Response) {
        res.status(200).json((await contactService.getAll()).map((contact) => ({ ...contact , user: contact.user.id})));
    }


    @ApiOperation({ description: 'Get a list of comments for a given projet' })
    @ApiResponse({
        status: 404,
        description: 'Projet not found',
    })
    @Get('/listQuestion')
    public async getContactByUser(req: Request, res: Response) {
        const  userId  = req.currentUser.userId;
        const user = await userService.getById(userId);

        if (!user)
            throw new NotFoundException('User not found');

        let contacts = await contactService.getContacts(userId);
        res.status(200).json(contacts.map(c => {return {
            ...c,
            user: c.user.id,
            
        }}));
    }


    @ApiOperation({ description: 'Create a new contat' })
    @ApiBody({
        type: PostContactDTO,
        description: 'infos about the new contact',
    })
    @ApiOkResponse(
        {
            description: 'Contact created',
            schema: {
                type: 'Contact',
                example: { id: 5, name: "Laure", email: 'info@gmail.com' , subject:"Question" , message: "Besoin d'une explication"},
            }
        }
    )
    @ApiResponse({
        status: 401,
        description: 'returned if the body request has missing required fields or existing category already has the given name',
    })
    @Post('/')
    public async createContact(req: Request, res: Response) {
        const { name,  email , subject , message } = req.body;
        const {userId } = req.currentUser;
        if (!name || !email || !subject || !message) {
            throw new BadRequestException('Missing required fields');
        }

        if (!/^[\w\-\.]+@[\w\-]+\.[\.a-z]+$/.test(email.trim().toLowerCase())) {
			throw new BadRequestException(`email ${email} must be a valid email address`);
		}

        const user = await userService.getById(userId);
        if(!user) {
            throw new NotFoundException('user does not exist');
        }

        await emailService.sendMailQuestion(email , subject, message);


        const contact = new Contact();
        contact.name = name;
        contact.email = email; 
        contact.subject = subject;
        contact.message = message;
        contact.user = user;
        const newContact = await contactService.create(contact);

        user.contacts.push(newContact);
        await userService.update(userId, user);
        res.status(200).json({ ...newContact , info: "Votre message a éte envoyé avec success" });
    }

    @ApiOperation({ description: 'Remove a comment from likes.' })
    @ApiResponse({
        status: 404,
        description: 'Contact not found',
    })
    @Delete('/:contactId')
    public async deleteContact(req: Request, res: Response) {
        const { contactId } = req.params;
        const userId  = req.currentUser.userId;
        let user = await userService.getById(userId);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const contact = await contactService.getById(Number(contactId));


        if (!contact) {
            throw new NotFoundException('Contact not found');
        }

        await contactService.delete(contact.id);
        user.contacts = user.contacts.filter(c => c.id !== contact.id);
        
        await userService.update(userId, user);
       
        return res.status(200).json({});
    }



}

export default new ContactController();