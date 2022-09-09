import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../error/UnauthorizedError.error';
import { decodeUser } from './decodeuser.middleware';

export const ensureAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	decodeUser
	if (req.currentUser?.userId) {
		return next();
	}

	throw new UnauthorizedError('Vous devez vous connecté');
};
