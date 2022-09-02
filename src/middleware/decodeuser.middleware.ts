import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config';
import { IPayload } from '../types/jwtpayload.interface';
import userService from '../service/user.service';
import { UnauthorizedError } from '../error/UnauthorizedError.error';


export const decodeUser = async (req: Request, res: Response, next: NextFunction) => {
	let token = req.headers['x-access_token'] as string  || req.headers['authorization'] ;
	
	let checkBearer = "Bearer ";
	if (token) {
		if (token.startsWith(checkBearer)) {
			token = token.slice(checkBearer.length, token.length);
			
			try {
				req.currentUser = {
					...jwt.verify(
						token,
						config.JWT_SECRET || ''
					) as unknown as IPayload, refresh: 0
					};
					if(!req.currentUser?.userId ) {
                        throw new UnauthorizedError('Please login ');
					}
					let $user = await userService.getById(req.currentUser.userId);
				    $user.active = new Date();
					await userService.update($user.id, $user);
					
			} catch (error) {
				next();
			}

		}
	}
	
	next();
};
