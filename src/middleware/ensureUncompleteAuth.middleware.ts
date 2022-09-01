import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../error/UnauthorizedError.error';

export const ensureUncompleteAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.currentUser?.userId && req.currentUser?.refresh) {
		if (req.currentUser.v == 0)
			return next();
		throw new UnauthorizedError('You are already verified');
	}

	throw new UnauthorizedError('Not Logged In');
};