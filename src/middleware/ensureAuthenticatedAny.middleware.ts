import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../error/UnauthorizedError.error';

export const ensureAuthenticatedAny = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.currentUser?.userId && req.currentUser?.refresh !== 1) {
        return next();
	}

	throw new UnauthorizedError('Not Logged In');
};